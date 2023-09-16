import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as appsync from "aws-cdk-lib/aws-appsync";
import { GetAppsyncResolveStack } from "./get-appsync-resolver";

interface GetAppsyncFuncStackProps extends cdk.StackProps {
  inventory_table: dynamodb.Table;
  api: appsync.GraphqlApi;
}
export class GetAppsyncFuncStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: GetAppsyncFuncStackProps) {
    super(scope, id, props);

    // const OrdersDS = props.api.addDynamoDbDataSource(
    //   "Order_data_source",
    //   props.orders_table
    // );

    const inventoryDS = props.api.addDynamoDbDataSource(
      "inventory_data",
      props.inventory_table
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

    const getUserInventoriesFunc = new appsync.AppsyncFunction(
      this,
      "getUserInventories",
      {
        name: "getUserInventoriesFunc",
        api: props.api,
        dataSource: inventoryDS,
        code: appsync.Code.fromAsset("src/queries/getUserInventories.js"),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      }
    );

    const get_user_func = new appsync.AppsyncFunction(this, "get_user", {
      name: "get_user_func",
      api: props.api,
      dataSource: inventoryDS,
      code: appsync.Code.fromAsset("src/queries/getEmployees.js"),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

    const get_inventories = new appsync.AppsyncFunction(
      this,
      "func-get-inventories",
      {
        name: "get_inventories_function",
        api: props.api,
        dataSource: inventoryDS,
        code: appsync.Code.fromAsset("src/queries/getInventories.js"),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      }
    );

    const get_items = new appsync.AppsyncFunction(this, "func-get-items", {
      name: "get_items_func",
      api: props.api,
      dataSource: inventoryDS,
      code: appsync.Code.fromAsset("src/queries/getItems.js"),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

    const get_inentory_items = new appsync.AppsyncFunction(
      this,
      "get-inventory-items",
      {
        name: "inventory_items_func",
        api: props.api,
        dataSource: inventoryDS,
        code: appsync.Code.fromAsset("src/queries/getInventoryItems.js"),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      }
    );

    const get_users_iventories_items = new appsync.AppsyncFunction(
      this,
      "get-inventory-items",
      {
        name: "inventory_items_func",
        api: props.api,
        dataSource: inventoryDS,
        code: appsync.Code.fromAsset("src/queries/getInventoryItems.js"),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      }
    );

    new GetAppsyncResolveStack(this, "get-inventory-items-resolver", {
      get_inventories_func: get_inventories,
      get_inventory_items_func: get_inentory_items,
      get_items_func: get_items,
      get_user_inventories_func: getUserInventoriesFunc,
      get_users_func: get_user_func,
      passthrough: passthrough,
      api: props.api,
      env: { account: this.account, region: this.region },
    });
  }
}
