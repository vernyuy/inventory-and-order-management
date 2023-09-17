import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as appsync from "aws-cdk-lib/aws-appsync";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { join } from "path";
import { bundleAppSyncResolver } from "./helpers";

interface InventoryAppsyncFuncStackProps extends cdk.StackProps {
  inventories_table: dynamodb.Table;
  api: appsync.GraphqlApi;
}
export class InventoryAppsyncFuncStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: InventoryAppsyncFuncStackProps
  ) {
    super(scope, id, props);
    const InventoryDS = props.api.addDynamoDbDataSource(
      "inventory_data_source",
      props.inventories_table
    );

    const passthrough = appsync.InlineCode.fromInline(`
        // The before step
        export function request(...args) {
          console.log(args);
          return {}
        }

        // The after step
        export function response(ctx) {
          return ctx.prev.result
        }
    `);
    const add_user = new appsync.AppsyncFunction(this, "func-add-post", {
      name: "add_employee",
      api: props.api,
      dataSource: InventoryDS,
      code: bundleAppSyncResolver("src/resolvers/createUser.ts"),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

    const add_item = new appsync.AppsyncFunction(this, "func-add-item", {
      name: "add_item",
      api: props.api,
      dataSource: InventoryDS,
      code: bundleAppSyncResolver("src/resolvers/createItem.ts"),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

    const add_inventory = new appsync.AppsyncFunction(
      this,
      "func-add-inventory",
      {
        name: "add_inventory",
        api: props.api,
        dataSource: InventoryDS,
        code: appsync.Code.fromAsset(
          join(__dirname, "./mappings/mutations/mutation.createInventory.js")
        ),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      }
    );

    new appsync.Resolver(this, "pipeline-resolver-create-item", {
      api: props.api,
      typeName: "Mutation",
      fieldName: "createItem",
      code: passthrough,
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [add_item],
    });

    new appsync.Resolver(this, "pipeline-resolver-create-inventory", {
      api: props.api,
      typeName: "Mutation",
      fieldName: "createInventory",
      code: passthrough,
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [add_inventory],
    });

    new appsync.Resolver(this, "pipeline-resolver-create-posts", {
      api: props.api,
      typeName: "Mutation",
      fieldName: "createUser",
      code: passthrough,
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [add_user],
    });
  }
}
