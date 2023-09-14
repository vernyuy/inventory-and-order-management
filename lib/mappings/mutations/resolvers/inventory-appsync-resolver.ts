import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as appsync from "aws-cdk-lib/aws-appsync";

interface InventoryAppsyncResolverStackProps extends cdk.StackProps {
  passthrough: appsync.InlineCode;
  create_item_func: appsync.AppsyncFunction;
  create_inventory_func: appsync.AppsyncFunction;
  create_user_func: appsync.AppsyncFunction;
  api: appsync.GraphqlApi;
}
export class InventoryAppsyncResolverStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: InventoryAppsyncResolverStackProps
  ) {
    super(scope, id, props);

    new appsync.Resolver(this, "pipeline-resolver-create-item", {
      api: props.api,
      typeName: "Mutation",
      fieldName: "createItem",
      code: props.passthrough,
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [props.create_item_func],
    });

    new appsync.Resolver(this, "pipeline-resolver-create-inventory", {
      api: props.api,
      typeName: "Mutation",
      fieldName: "createInventory",
      code: props.passthrough,
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [props.create_inventory_func],
    });

    new appsync.Resolver(this, "pipeline-resolver-create-posts", {
      api: props.api,
      typeName: "Mutation",
      fieldName: "createUser",
      code: props.passthrough,
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [props.create_user_func],
    });
  }
}
