#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { ServicesStack } from "../lib/p14c-backend-services-stack";
import { FrontendDeployStack } from "../lib/p14c-frontend-deploy-stack";

const app = new cdk.App();
const services = new ServicesStack(app, "P14cBackendServicesStack");
new FrontendDeployStack(app, "P14cFrontendDeployStack", {
  lolliesTableName: services.lolliesTableName,
  env: {
    region: "us-east-2",
  },
});
