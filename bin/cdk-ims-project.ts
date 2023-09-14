#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { CdkImsProjectStack } from "../lib/cdk-ims-project-stack";
// import lambdaStack.ts
// import { LambdaStack } from "../lib/compute/lambdaStack";

const app = new cdk.App();
// const lambdas = new LambdaStack(app, "LambdaStack", {
//   env: { account: "132260253285", region: "eu-west-1" },
// });
// new CdkImsProjectStack(app, "CdkImsProjectStack", {
//   targetLambda: lambdas.lambdaName,
//   env: { account: "132260253285", region: "eu-west-1" },
// });

new CdkImsProjectStack(app, "CdkImsProjectStack", {
  env: { account: "132260253285", region: "eu-west-1" },
});
