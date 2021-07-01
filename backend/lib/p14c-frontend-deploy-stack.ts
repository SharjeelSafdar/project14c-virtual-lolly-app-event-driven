import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as lambda from "@aws-cdk/aws-lambda";
import * as cloudFront from "@aws-cdk/aws-cloudfront";
import * as origins from "@aws-cdk/aws-cloudfront-origins";
import * as ddb from "@aws-cdk/aws-dynamodb";

interface FrontendDeployStackProps extends cdk.StackProps {
  lolliesTableName: string;
}

export class FrontendDeployStack extends cdk.Stack {
  constructor(
    scope: cdk.Construct,
    id: string,
    props: FrontendDeployStackProps
  ) {
    super(scope, id, props);

    // Create a bucket to upload the Gatsby static web app
    // We will deploy our static site through GitHub Actions into this bucket.
    const bucketForFrontendAssets = new s3.Bucket(
      this,
      "P14cBucketForFrontendAssets",
      {
        bucketName: "p14c-bucket-for-frontend-assets",
        versioned: true,
        autoDeleteObjects: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        websiteIndexDocument: "index.html",
        publicReadAccess: true,
      }
    );

    const lolliesTable = ddb.Table.fromTableName(
      this,
      "P14cLolliesTable",
      props.lolliesTableName
    );

    const ssrLolliesFunction = new cloudFront.experimental.EdgeFunction(
      this,
      "P14cSsrLolliesFunction",
      {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "index.handler",
        code: lambda.Code.fromAsset("utils/lambda/edgeLambda"),
      }
    );
    lolliesTable.grantReadData(ssrLolliesFunction);

    const s3Origin = new origins.S3Origin(bucketForFrontendAssets);
    // Create a CDN to deploy the website
    const distribution = new cloudFront.Distribution(this, "P14cFrontendDist", {
      defaultBehavior: {
        origin: s3Origin,
        edgeLambdas: [
          {
            functionVersion: ssrLolliesFunction.currentVersion,
            eventType: cloudFront.LambdaEdgeEventType.ORIGIN_RESPONSE,
          },
        ],
      },
      defaultRootObject: "index.html",
    });

    // Prints out the web endpoint to the terminal
    new cdk.CfnOutput(this, "P14cDistributionDomainName", {
      value: distribution.domainName,
    });

    cdk.Tags.of(this).add("Project", "P14c-Virtual-Lolly-App-Event-Driven");
  }
}
