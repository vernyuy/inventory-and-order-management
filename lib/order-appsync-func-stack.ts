import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as appsync from "aws-cdk-lib/aws-appsync";
import { join } from "path";

interface OrderAppsyncFuncStackProps extends cdk.StackProps {
  orders_table: dynamodb.Table;
  api: appsync.GraphqlApi;
}
export class OrderAppsyncFuncStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: OrderAppsyncFuncStackProps) {
    super(scope, id, props);

    const OrdersDS = props.api.addDynamoDbDataSource(
      "Order_data_source",
      props.orders_table
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

    const add_item_to_cart = new appsync.AppsyncFunction(
      this,
      "add_item_to_cart1",
      {
        name: "add_item_to_Cart1",
        api: props.api,
        dataSource: OrdersDS,
        code: appsync.Code.fromAsset(
          join(__dirname, "mappings/mutations/mutation.addItemToCart.js")
        ),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      }
    );
    const place_order = new appsync.AppsyncFunction(this, "place_order", {
      name: "place_order",
      api: props.api,
      dataSource: OrdersDS,
      code: appsync.Code.fromAsset(
        join(__dirname, "mappings/mutations/mutation.placeOrder.js")
      ),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

    new appsync.Resolver(this, "pipeline-resolver-add-item-to-cart", {
      api: props.api,
      typeName: "Mutation",
      fieldName: "addItemToCart",
      code: passthrough,
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [add_item_to_cart],
    });

    new appsync.Resolver(this, "pipeline-resolver-place_order", {
      api: props.api,
      typeName: "Mutation",
      fieldName: "placeOrder",
      code: passthrough,
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [place_order],
    });
  }
}
