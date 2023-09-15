"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeWebhookStack = void 0;
const cdk = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
class StripeWebhookStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const webhook = new lambda.Function(this, "webhook-fn", {
            handler: "webhook.lambdaHandler",
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromAsset("src"),
            environment: {
                TABLE_NAME: props.orders_table.tableName,
                USER_TABLE: props.inventory_table.tableName,
                REGION: cdk.Stack.of(this).region,
            },
            tracing: aws_lambda_1.Tracing.ACTIVE,
            //   layers: [powertoolsLayer],
        });
        props.orders_table.grantWriteData(webhook);
        props.inventory_table.grantReadData(webhook);
        const stripe_api = new apigateway.RestApi(this, "webhook");
        const webhook_api = stripe_api.root.addResource("webhook");
        webhook_api.addMethod("POST", new apigateway.LambdaIntegration(webhook));
    }
}
exports.StripeWebhookStack = StripeWebhookStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaXBlLXdlYmhvb2stc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdHJpcGUtd2ViaG9vay1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBbUM7QUFFbkMsaURBQWlEO0FBQ2pELHlEQUF5RDtBQUV6RCx1REFBaUQ7QUFNakQsTUFBYSxrQkFBbUIsU0FBUSxHQUFHLENBQUMsS0FBSztJQUMvQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQThCO1FBQ3RFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3hCLE1BQU0sT0FBTyxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ3RELE9BQU8sRUFBRSx1QkFBdUI7WUFDaEMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO1lBQ2xDLFdBQVcsRUFBRTtnQkFDWCxVQUFVLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxTQUFTO2dCQUN4QyxVQUFVLEVBQUUsS0FBSyxDQUFDLGVBQWUsQ0FBQyxTQUFTO2dCQUMzQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTTthQUNsQztZQUNELE9BQU8sRUFBRSxvQkFBTyxDQUFDLE1BQU07WUFDdkIsK0JBQStCO1NBQ2hDLENBQUMsQ0FBQztRQUVILEtBQUssQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzNDLEtBQUssQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTdDLE1BQU0sVUFBVSxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDM0QsTUFBTSxXQUFXLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDM0QsV0FBVyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxVQUFVLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUMzRSxDQUFDO0NBQ0Y7QUF2QkQsZ0RBdUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gXCJhd3MtY2RrLWxpYlwiO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSBcImNvbnN0cnVjdHNcIjtcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWxhbWJkYVwiO1xuaW1wb3J0ICogYXMgYXBpZ2F0ZXdheSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWFwaWdhdGV3YXlcIjtcbmltcG9ydCAqIGFzIGR5bmFtb2RiIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtZHluYW1vZGJcIjtcbmltcG9ydCB7IFRyYWNpbmcgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWxhbWJkYVwiO1xuXG5pbnRlcmZhY2UgU3RyaXBlV2ViaG9va1N0YWNrUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XG4gIG9yZGVyc190YWJsZTogZHluYW1vZGIuVGFibGU7XG4gIGludmVudG9yeV90YWJsZTogZHluYW1vZGIuVGFibGU7XG59XG5leHBvcnQgY2xhc3MgU3RyaXBlV2ViaG9va1N0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFN0cmlwZVdlYmhvb2tTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG4gICAgY29uc3Qgd2ViaG9vayA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgXCJ3ZWJob29rLWZuXCIsIHtcbiAgICAgIGhhbmRsZXI6IFwid2ViaG9vay5sYW1iZGFIYW5kbGVyXCIsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChcInNyY1wiKSxcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIFRBQkxFX05BTUU6IHByb3BzLm9yZGVyc190YWJsZS50YWJsZU5hbWUsXG4gICAgICAgIFVTRVJfVEFCTEU6IHByb3BzLmludmVudG9yeV90YWJsZS50YWJsZU5hbWUsXG4gICAgICAgIFJFR0lPTjogY2RrLlN0YWNrLm9mKHRoaXMpLnJlZ2lvbixcbiAgICAgIH0sXG4gICAgICB0cmFjaW5nOiBUcmFjaW5nLkFDVElWRSxcbiAgICAgIC8vICAgbGF5ZXJzOiBbcG93ZXJ0b29sc0xheWVyXSxcbiAgICB9KTtcblxuICAgIHByb3BzLm9yZGVyc190YWJsZS5ncmFudFdyaXRlRGF0YSh3ZWJob29rKTtcbiAgICBwcm9wcy5pbnZlbnRvcnlfdGFibGUuZ3JhbnRSZWFkRGF0YSh3ZWJob29rKTtcblxuICAgIGNvbnN0IHN0cmlwZV9hcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHRoaXMsIFwid2ViaG9va1wiKTtcbiAgICBjb25zdCB3ZWJob29rX2FwaSA9IHN0cmlwZV9hcGkucm9vdC5hZGRSZXNvdXJjZShcIndlYmhvb2tcIik7XG4gICAgd2ViaG9va19hcGkuYWRkTWV0aG9kKFwiUE9TVFwiLCBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbih3ZWJob29rKSk7XG4gIH1cbn1cbiJdfQ==