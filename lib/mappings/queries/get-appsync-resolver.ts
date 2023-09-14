import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as appsync from "aws-cdk-lib/aws-appsync";

interface GetAppsyncResolveStackProps extends cdk.StackProps {
  passthrough: appsync.InlineCode;
  get_inventory_items_func: appsync.AppsyncFunction;
  get_items_func: appsync.AppsyncFunction;
  get_inventories_func: appsync.AppsyncFunction;
  get_users_func: appsync.AppsyncFunction;
  get_user_inventories_func: appsync.AppsyncFunction;
  api: appsync.GraphqlApi;
}
export class GetAppsyncResolveStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: GetAppsyncResolveStackProps
  ) {
    super(scope, id, props);

    new appsync.Resolver(this, "pipeline-resolver-get-items", {
      api: props.api,
      typeName: "Query",
      fieldName: "items",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [props.get_items_func],
      code: props.passthrough,
    });

    new appsync.Resolver(this, "getUserInventoriesRes", {
      api: props.api,
      typeName: "Query",
      fieldName: "getUserInventories",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [props.get_user_inventories_func],
      code: props.passthrough,
    });

    new appsync.Resolver(this, "pipeline-resolver-get-users", {
      api: props.api,
      typeName: "Query",
      fieldName: "users",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [props.get_users_func],
      code: props.passthrough,
    });

    new appsync.Resolver(this, "pipeline-resolver-get-inventories", {
      api: props.api,
      typeName: "Query",
      fieldName: "inventories",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [props.get_inventories_func],
      code: props.passthrough,
    });

    new appsync.Resolver(this, "pipeline-resolver-get-inventory-items", {
      api: props.api,
      typeName: "Query",
      fieldName: "getInventoryItems",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [props.get_inventory_items_func],
      code: props.passthrough,
    });
  }
}
