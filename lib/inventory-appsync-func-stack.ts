import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as appsync from "aws-cdk-lib/aws-appsync";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { join } from "path";
import { bundleAppSyncResolver } from "./utils/helpers";

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
      // code: appsync.Code.fromAsset(
      //   join(__dirname, "./mappings/mutations/mutation.createUser.js")
      // ),
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

    const get_user_inventories = new appsync.AppsyncFunction(
      this,
      "getUserInventories",
      {
        name: "getUserInventoriesFunc",
        api: props.api,
        dataSource: InventoryDS,
        code: appsync.Code.fromAsset(
          join(__dirname, "mappings/queries/query.getUserInventories.js")
        ),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      }
    );

    const get_users_func = new appsync.AppsyncFunction(this, "get_user", {
      name: "get_user_func",
      api: props.api,
      dataSource: InventoryDS,
      code: appsync.Code.fromAsset(
        join(__dirname, "mappings/queries/query.getUsers.js")
      ),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

    const get_inventories = new appsync.AppsyncFunction(
      this,
      "func-get-inventories",
      {
        name: "get_inventories_function",
        api: props.api,
        dataSource: InventoryDS,
        code: appsync.Code.fromAsset(
          join(__dirname, "mappings/queries/query.getInventories.js")
        ),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      }
    );

    const get_items = new appsync.AppsyncFunction(this, "func-get-items", {
      name: "get_items_func",
      api: props.api,
      dataSource: InventoryDS,
      code: appsync.Code.fromAsset(
        join(__dirname, "mappings/queries/query.getItems.js")
      ),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

    const get_inentory_items = new appsync.AppsyncFunction(
      this,
      "get-inventory-items",
      {
        name: "inventory_items_func",
        api: props.api,
        dataSource: InventoryDS,
        code: appsync.Code.fromAsset(
          join(__dirname, "mappings/queries/query.getInventoryItems.js")
        ),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      }
    );

    const get_users_iventories_items = new appsync.AppsyncFunction(
      this,
      "get_users_iventories_items",
      {
        name: "get_users_iventories_items",
        api: props.api,
        dataSource: InventoryDS,
        code: appsync.Code.fromAsset(
          join(__dirname, "mappings/queries/query.getUsersInventoriesItems.js")
        ),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      }
    );

    new appsync.Resolver(this, "pipeline-resolver-get-items", {
      api: props.api,
      typeName: "Query",
      fieldName: "getItems",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [get_items],
      code: passthrough,
    });

    new appsync.Resolver(this, "getUserInventoriesRes", {
      api: props.api,
      typeName: "Query",
      fieldName: "getUserInventories",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [get_user_inventories],
      code: passthrough,
    });

    new appsync.Resolver(this, "pipeline-resolver-get-users", {
      api: props.api,
      typeName: "Query",
      fieldName: "getUsers",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [get_users_func],
      code: passthrough,
    });

    new appsync.Resolver(this, "pipeline-resolver-get-inventories", {
      api: props.api,
      typeName: "Query",
      fieldName: "getInventories",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [get_inventories],
      code: passthrough,
    });

    new appsync.Resolver(this, "pipeline-resolver-get-inventory-items", {
      api: props.api,
      typeName: "Query",
      fieldName: "getInventoryItems",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [get_inentory_items],
      code: passthrough,
    });

    new appsync.Resolver(
      this,
      "pipeline-resolver-get-users-inventories-items",
      {
        api: props.api,
        typeName: "Query",
        fieldName: "getUsersInventoriesItems",
        runtime: appsync.FunctionRuntime.JS_1_0_0,
        pipelineConfig: [get_users_iventories_items],
        code: passthrough,
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
