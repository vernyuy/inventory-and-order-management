import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as appsync from "aws-cdk-lib/aws-appsync";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { InventoryAppsyncResolverStack } from "../resolvers/inventory-appsync-resolver";

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
    const add_emp = new appsync.AppsyncFunction(this, "func-add-post", {
      name: "add_employee",
      api: props.api,
      dataSource: InventoryDS,
      code: appsync.Code.fromAsset("src/mutations/createEmployee.js"),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

    const add_item = new appsync.AppsyncFunction(this, "func-add-item", {
      name: "add_item",
      api: props.api,
      dataSource: InventoryDS,
      code: appsync.Code.fromAsset("src/mutations/createItem.js"),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

    const add_inventory = new appsync.AppsyncFunction(
      this,
      "func-add-inventory",
      {
        name: "add_inventory",
        api: props.api,
        dataSource: InventoryDS,
        code: appsync.Code.fromAsset("src/mutations/createInventory.js"),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      }
    );

    new InventoryAppsyncResolverStack(this, "InventoryResolver", {
      api: props.api,
      create_inventory_func: add_inventory,
      create_item_func: add_item,
      create_user_func: add_emp,
      passthrough: passthrough,
      env: { account: this.account, region: this.region },
    });
  }
}
