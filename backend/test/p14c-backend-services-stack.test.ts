import { expect as expectCDK, haveResource } from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import { ServicesStack } from "../lib/p14c-backend-services-stack";

const createTestStack = (app: cdk.App) => new ServicesStack(app, "MyTestStack");

test("Stack has a DynamoDB Table", () => {
  const app = new cdk.App();
  // WHEN
  const stack = createTestStack(app);
  // THEN
  expectCDK(stack).to(
    haveResource("AWS::DynamoDB::Table", {
      TableName: "P14cLolliesTable",
    })
  );
});

test("Stack has an AppSync GraphQL API", () => {
  const app = new cdk.App();
  // WHEN
  const stack = createTestStack(app);
  // THEN
  expectCDK(stack).to(haveResource("AWS::AppSync::GraphQLApi"));
});

test("Stack has an AppSync GraphQL Schema", () => {
  const app = new cdk.App();
  // WHEN
  const stack = createTestStack(app);
  // THEN
  expectCDK(stack).to(haveResource("AWS::AppSync::GraphQLSchema"));
});

test("GraphQL API has a DynamoDB Data Source", () => {
  const app = new cdk.App();
  // WHEN
  const stack = createTestStack(app);
  // THEN
  expectCDK(stack).to(
    haveResource("AWS::AppSync::DataSource", {
      Type: "AMAZON_DYNAMODB",
    })
  );
});

test("GraphQL API has an HTTP Data Source", () => {
  const app = new cdk.App();
  // WHEN
  const stack = createTestStack(app);
  // THEN
  expectCDK(stack).to(
    haveResource("AWS::AppSync::DataSource", {
      Type: "HTTP",
    })
  );
});

test("GraphQL API has a None Data Source", () => {
  const app = new cdk.App();
  // WHEN
  const stack = createTestStack(app);
  // THEN
  expectCDK(stack).to(
    haveResource("AWS::AppSync::DataSource", {
      Type: "NONE",
    })
  );
});

test("Stack has a Lambda Function for DynamoDB", () => {
  const app = new cdk.App();
  // WHEN
  const stack = createTestStack(app);
  // THEN
  expectCDK(stack).to(
    haveResource("AWS::Lambda::Function", {
      FunctionName: "P14c-Ddb-Lambda",
    })
  );
});

test("Stack has a Lambda Function for GraphQL Mutation", () => {
  const app = new cdk.App();
  // WHEN
  const stack = createTestStack(app);
  // THEN
  expectCDK(stack).to(
    haveResource("AWS::Lambda::Function", {
      FunctionName: "P14c-GQL-Lambda",
    })
  );
});

test("Stack has a Lambda Function for SNS", () => {
  const app = new cdk.App();
  // WHEN
  const stack = createTestStack(app);
  // THEN
  expectCDK(stack).to(
    haveResource("AWS::Lambda::Function", {
      FunctionName: "P14c-SNS-Lambda",
    })
  );
});

test("Stack has an SNS Topic", () => {
  const app = new cdk.App();
  // WHEN
  const stack = createTestStack(app);
  // THEN
  expectCDK(stack).to(
    haveResource("AWS::SNS::Topic", {
      TopicName: "P14c-Lolly-Topic",
    })
  );
});

test("Stack has an Email subscription for the SNS Topic", () => {
  const app = new cdk.App();
  // WHEN
  const stack = createTestStack(app);
  // THEN
  expectCDK(stack).to(
    haveResource("AWS::SNS::Subscription", {
      Protocol: "email-json",
    })
  );
});

test("Stack has an SQS Dead Letter Queue for the SNS Topic", () => {
  const app = new cdk.App();
  // WHEN
  const stack = createTestStack(app);
  // THEN
  expectCDK(stack).to(haveResource("AWS::SQS::Queue"));
});

test("Stack has a State Machine to Orchestrate the Lambda functions", () => {
  const app = new cdk.App();
  // WHEN
  const stack = createTestStack(app);
  // THEN
  expectCDK(stack).to(
    haveResource("AWS::StepFunctions::StateMachine", {
      StateMachineName: "P14c-Lolly-State-Machine",
    })
  );
});

test("Stack has an Event Rule to Invoke the State Machine", () => {
  const app = new cdk.App();
  // WHEN
  const stack = createTestStack(app);
  // THEN
  expectCDK(stack).to(
    haveResource("AWS::Events::Rule", {
      EventPattern: {
        source: ["p14c-appsync-api"],
        "detail-type": ["createLolly"],
      },
    })
  );
});
