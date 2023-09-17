import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Tracing } from "aws-cdk-lib/aws-lambda";
import { join } from "path";

interface StripeWebhookStackProps extends cdk.StackProps {
  orders_table: dynamodb.Table;
  inventory_table: dynamodb.Table;
}
export class StripeWebhookStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: StripeWebhookStackProps) {
    super(scope, id, props);
    const webhook = new lambda.Function(this, "webhook-fn", {
      handler: "webhook.lambdaHandler",
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset(join(__dirname, "lambda-fns")),
      environment: {
        TABLE_NAME: props.orders_table.tableName,
        USER_TABLE: props.inventory_table.tableName,
        REGION: cdk.Stack.of(this).region,
      },
      tracing: Tracing.ACTIVE,
    });

    props.orders_table.grantWriteData(webhook);
    props.inventory_table.grantReadData(webhook);

    const stripe_api = new apigateway.RestApi(this, "webhook");
    const webhook_api = stripe_api.root.addResource("webhook");
    webhook_api.addMethod("POST", new apigateway.LambdaIntegration(webhook));
  }
}
