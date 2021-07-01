import * as cdk from "@aws-cdk/core";
import * as appsync from "@aws-cdk/aws-appsync";
import * as ddb from "@aws-cdk/aws-dynamodb";
import * as events from "@aws-cdk/aws-events";
import * as eventTargets from "@aws-cdk/aws-events-targets";
import * as lambda from "@aws-cdk/aws-lambda";
import * as sns from "@aws-cdk/aws-sns";
import * as snsSubscriptions from "@aws-cdk/aws-sns-subscriptions";
import * as sqs from "@aws-cdk/aws-sqs";
import * as sf from "@aws-cdk/aws-stepfunctions";
import * as sfTasks from "@aws-cdk/aws-stepfunctions-tasks";

export class ServicesStack extends cdk.Stack {
  public readonly lolliesTableName = "P14cLolliesTable";
  private readonly EVENT_SOURCE = "p14c-appsync-api";

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /* ********************************************************** */
    /* *************** DynamoDB Table for lollies *************** */
    /* ********************************************************** */
    const lolliesTable = new ddb.Table(this, "P14cLolliesTable", {
      tableName: this.lolliesTableName,
      partitionKey: {
        name: "id",
        type: ddb.AttributeType.STRING,
      },
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    /* *************************************************** */
    /* *************** AppSync GraphQL API *************** */
    /* *************************************************** */
    const gqlApi = new appsync.GraphqlApi(this, "P14cGraphQlApi", {
      name: "P14c-GraphQL-Api",
      schema: appsync.Schema.fromAsset("utils/graphql/schema.gql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          },
        },
      },
    });

    /* ********************************************************** */
    /* *************** GraphQL API Query Resolver *************** */
    /* ********************************************************** */
    const ddbDataSource = gqlApi.addDynamoDbDataSource(
      "P14cDdbDataSource",
      lolliesTable
    );

    ddbDataSource.createResolver({
      typeName: "Query",
      fieldName: "lollies",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList(),
    });

    /* ************************************************************** */
    /* *************** GraphQL API Mutation Resolvers *************** */
    /* ************************************************************** */
    const httpEventBridgeDS = gqlApi.addHttpDataSource(
      "P14cHttpEventBridgeDS",
      `https://events.${this.region}.amazonaws.com/`,
      {
        name: "p14cHttpEventBridgeDS",
        description: "Sending events to EventBridge on AppSync mutations",
        authorizationConfig: {
          signingRegion: this.region,
          signingServiceName: "events",
        },
      }
    );
    events.EventBus.grantAllPutEvents(httpEventBridgeDS);

    const createLollyArgs = `\\\"clientId\\\": \\\"$ctx.args.clientId\\\", \\\"newLolly\\\": { \\\"topColor\\\": \\\"$ctx.args.newLolly.topColor\\\", \\\"middleColor\\\": \\\"$ctx.args.newLolly.middleColor\\\", \\\"bottomColor\\\": \\\"$ctx.args.newLolly.bottomColor\\\", \\\"recipientName\\\": \\\"$ctx.args.newLolly.recipientName\\\", \\\"message\\\": \\\"$ctx.args.newLolly.message\\\", \\\"sendersName\\\": \\\"$ctx.args.newLolly.sendersName\\\" }`;
    httpEventBridgeDS.createResolver({
      typeName: "Mutation",
      fieldName: "createLolly",
      requestMappingTemplate: appsync.MappingTemplate.fromString(`
        {
          "version": "2018-05-29",
          "method": "POST",
          "resourcePath": "/",
          "params": {
            "headers": {
              "content-type": "application/x-amz-json-1.1",
              "x-amz-target":"AWSEvents.PutEvents"
            },
            "body": {
              "Entries": [
                {
                  "DetailType": "createLolly",
                  "Source": "${this.EVENT_SOURCE}",
                  "EventBusName": "default",
                  "Detail": "{${createLollyArgs}}"
                }
              ]
            }
          }
        }
      `),
      responseMappingTemplate: appsync.MappingTemplate.fromString(`
        #if($ctx.error)
          $util.error($ctx.error.message, $ctx.error.type)
        #end

        #if($ctx.result.statusCode == 200)
        {
          "result": "$util.parseJson($ctx.result.body)"
        }
        #else
          $utils.appendError($ctx.result.body, $ctx.result.statusCode)
        #end
      `),
    });

    /* ************************************************************ */
    /* *************** GraphQL API None Data Source *************** */
    /* ************************************************************ */
    const appsyncNoneDS = gqlApi.addNoneDataSource("P14cNoneDS", {
      name: "P14cNoneDS",
      description: "Does not save incoming data anywhere",
    });

    appsyncNoneDS.createResolver({
      typeName: "Mutation",
      fieldName: "lollyCreated",
      requestMappingTemplate: appsync.MappingTemplate.fromString(`
        {
          "version" : "2017-02-28",
          "payload": $util.toJson($ctx.args)
        }
      `),
      responseMappingTemplate: appsync.MappingTemplate.fromString(
        "$util.toJson($context.result)"
      ),
    });

    /* ********************************************************************* */
    /* ********** Lambda Function to Create New Lolly in DynamoDB ********** */
    /* ********************************************************************* */
    const ddbLambda = new lambda.Function(this, "P14cDdbLambda", {
      functionName: "P14c-Ddb-Lambda",
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("utils/lambda/ddbLambda"),
      handler: "index.handler",
      environment: {
        LOLLIES_TABLE_NAME: lolliesTable.tableName,
        STACK_REGION: this.region,
      },
    });
    lolliesTable.grantReadWriteData(ddbLambda);

    /* ******************************************************************* */
    /* ********** Lambda Function to Call lollyCreated Mutation ********** */
    /* ******************************************************************* */
    const gqlLambda = new lambda.Function(this, "P14cGqlLambda", {
      functionName: "P14c-GQL-Lambda",
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("utils/lambda/gqlLambda"),
      handler: "index.handler",
      environment: {
        APPSYNC_GRAPHQL_API_ENDPOINT: gqlApi.graphqlUrl,
        APPSYNC_API_KEY: gqlApi.apiKey as string,
        STACK_REGION: this.region,
      },
    });
    gqlApi.grantMutation(gqlLambda);

    /* *********************************************************************** */
    /* ********** SNS Topic for Publishing Messages for New Lollies ********** */
    /* *********************************************************************** */
    const snsLollyCreationTopic = new sns.Topic(this, "P14cLollyTopic", {
      topicName: "P14c-Lolly-Topic",
    });

    const deadLetterQueue = new sqs.Queue(this, "P14cDlq");

    snsLollyCreationTopic.addSubscription(
      new snsSubscriptions.EmailSubscription("miansharjeelsafdar@gmail.com", {
        deadLetterQueue,
        json: true,
        filterPolicy: {
          app: sns.SubscriptionFilter.stringFilter({
            allowlist: ["virtual-lolly"],
          }),
        },
      })
    );

    /* *********************************************************************** */
    /* ********** Lambda Function to publish a message on SNS topic ********** */
    /* *********************************************************************** */
    const snsLambda = new lambda.Function(this, "P14cSnsLambda", {
      functionName: "P14c-SNS-Lambda",
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("utils/lambda/snsLambda"),
      handler: "index.handler",
      environment: {
        TOPIC_ARN: snsLollyCreationTopic.topicArn,
        STACK_REGION: this.region,
      },
    });
    snsLollyCreationTopic.grantPublish(snsLambda);

    /* **************************************************************** */
    /* ********** State Machine to Be Invoked By EventBridge ********** */
    /* **************************************************************** */
    const ddbStep = new sfTasks.LambdaInvoke(this, "InvokeDdbLambda", {
      lambdaFunction: ddbLambda,
    });
    const gqlStep = new sfTasks.LambdaInvoke(this, "InvokeGqlLambda", {
      lambdaFunction: gqlLambda,
      inputPath: "$.Payload",
    });
    const snsStep = new sfTasks.LambdaInvoke(this, "InvokeSnsLambda", {
      lambdaFunction: snsLambda,
      inputPath: "$.Payload",
    });

    const stateMachineDefinition = sf.Chain.start(ddbStep)
      .next(gqlStep)
      .next(snsStep);

    const stateMachine = new sf.StateMachine(this, "P14cStateMachine", {
      stateMachineName: "P14c-Lolly-State-Machine",
      definition: stateMachineDefinition,
    });

    /* ****************************************************************** */
    /* ********** EventBridge Rule to Invoke the State Machine ********** */
    /* ****************************************************************** */
    new events.Rule(this, "P14cEventRule", {
      description:
        "Rule to invoke state machine when a mutation is run in AppSync",
      eventPattern: {
        source: [this.EVENT_SOURCE],
        detailType: ["createLolly"],
      },
      targets: [new eventTargets.SfnStateMachine(stateMachine)],
    });

    cdk.Tags.of(this).add("Project", "P14c-Virtual-Lolly-App-Event-Driven");
  }
}
