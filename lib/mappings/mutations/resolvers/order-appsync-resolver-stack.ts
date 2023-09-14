import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as appsync from "aws-cdk-lib/aws-appsync";

interface AppSyncResolverStackProps extends cdk.StackProps {
  passthrough: appsync.InlineCode;
  add_item_to_cart_func: appsync.AppsyncFunction;
  place_order_func: appsync.AppsyncFunction;
  api: appsync.GraphqlApi;
}
export class OrderAppSyncResolverStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AppSyncResolverStackProps) {
    super(scope, id, props);

    new appsync.Resolver(this, "pipeline-resolver-add-item-to-cart", {
      api: props.api,
      typeName: "Mutation",
      fieldName: "addItemToCart",
      code: props.passthrough,
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [props.add_item_to_cart_func],
    });

    new appsync.Resolver(this, "pipeline-resolver-place_order", {
      api: props.api,
      typeName: "Mutation",
      fieldName: "placeOrder",
      code: props.passthrough,
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [props.place_order_func],
    });
  }
}
