"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderAppsyncFuncStack = void 0;
const cdk = require("aws-cdk-lib");
const appsync = require("aws-cdk-lib/aws-appsync");
const order_appsync_resolver_stack_1 = require("../resolvers/order-appsync-resolver-stack");
class OrderAppsyncFuncStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const OrdersDS = props.api.addDynamoDbDataSource("Order_data_source", props.orders_table);
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
        const add_item_to_cart = new appsync.AppsyncFunction(this, "add_item_to_cart1", {
            name: "add_item_to_Cart1",
            api: props.api,
            dataSource: OrdersDS,
            code: appsync.Code.fromAsset("src/mutations/addItemToCart.js"),
            runtime: appsync.FunctionRuntime.JS_1_0_0,
        });
        const place_order = new appsync.AppsyncFunction(this, "place_order", {
            name: "place_order",
            api: props.api,
            dataSource: OrdersDS,
            code: appsync.Code.fromAsset("src/mutations/placeOrder.js"),
            runtime: appsync.FunctionRuntime.JS_1_0_0,
        });
        new order_appsync_resolver_stack_1.OrderAppSyncResolverStack(this, "AppSyncResolverStack", {
            add_item_to_cart_func: add_item_to_cart,
            place_order_func: place_order,
            api: props.api,
            passthrough: passthrough,
            env: { account: "132260253285", region: "eu-west-1" },
        });
    }
}
exports.OrderAppsyncFuncStack = OrderAppsyncFuncStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXItYXBwc3luYy1mdW5jLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsib3JkZXItYXBwc3luYy1mdW5jLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFtQztBQUduQyxtREFBbUQ7QUFDbkQsNEZBQXNGO0FBTXRGLE1BQWEscUJBQXNCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDbEQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFpQztRQUN6RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUM5QyxtQkFBbUIsRUFDbkIsS0FBSyxDQUFDLFlBQVksQ0FDbkIsQ0FBQztRQUVGLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDOzs7Ozs7Ozs7OztLQVdqRCxDQUFDLENBQUM7UUFFSCxNQUFNLGdCQUFnQixHQUFHLElBQUksT0FBTyxDQUFDLGVBQWUsQ0FDbEQsSUFBSSxFQUNKLG1CQUFtQixFQUNuQjtZQUNFLElBQUksRUFBRSxtQkFBbUI7WUFDekIsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO1lBQ2QsVUFBVSxFQUFFLFFBQVE7WUFDcEIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGdDQUFnQyxDQUFDO1lBQzlELE9BQU8sRUFBRSxPQUFPLENBQUMsZUFBZSxDQUFDLFFBQVE7U0FDMUMsQ0FDRixDQUFDO1FBQ0YsTUFBTSxXQUFXLEdBQUcsSUFBSSxPQUFPLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDbkUsSUFBSSxFQUFFLGFBQWE7WUFDbkIsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO1lBQ2QsVUFBVSxFQUFFLFFBQVE7WUFDcEIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLDZCQUE2QixDQUFDO1lBQzNELE9BQU8sRUFBRSxPQUFPLENBQUMsZUFBZSxDQUFDLFFBQVE7U0FDMUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSx3REFBeUIsQ0FBQyxJQUFJLEVBQUUsc0JBQXNCLEVBQUU7WUFDMUQscUJBQXFCLEVBQUUsZ0JBQWdCO1lBQ3ZDLGdCQUFnQixFQUFFLFdBQVc7WUFDN0IsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO1lBQ2QsV0FBVyxFQUFFLFdBQVc7WUFDeEIsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFO1NBQ3RELENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQWpERCxzREFpREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSBcImF3cy1jZGstbGliXCI7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tIFwiY29uc3RydWN0c1wiO1xuaW1wb3J0ICogYXMgZHluYW1vZGIgZnJvbSBcImF3cy1jZGstbGliL2F3cy1keW5hbW9kYlwiO1xuaW1wb3J0ICogYXMgYXBwc3luYyBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWFwcHN5bmNcIjtcbmltcG9ydCB7IE9yZGVyQXBwU3luY1Jlc29sdmVyU3RhY2sgfSBmcm9tIFwiLi4vcmVzb2x2ZXJzL29yZGVyLWFwcHN5bmMtcmVzb2x2ZXItc3RhY2tcIjtcblxuaW50ZXJmYWNlIE9yZGVyQXBwc3luY0Z1bmNTdGFja1Byb3BzIGV4dGVuZHMgY2RrLlN0YWNrUHJvcHMge1xuICBvcmRlcnNfdGFibGU6IGR5bmFtb2RiLlRhYmxlO1xuICBhcGk6IGFwcHN5bmMuR3JhcGhxbEFwaTtcbn1cbmV4cG9ydCBjbGFzcyBPcmRlckFwcHN5bmNGdW5jU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogT3JkZXJBcHBzeW5jRnVuY1N0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IE9yZGVyc0RTID0gcHJvcHMuYXBpLmFkZER5bmFtb0RiRGF0YVNvdXJjZShcbiAgICAgIFwiT3JkZXJfZGF0YV9zb3VyY2VcIixcbiAgICAgIHByb3BzLm9yZGVyc190YWJsZVxuICAgICk7XG5cbiAgICBjb25zdCBwYXNzdGhyb3VnaCA9IGFwcHN5bmMuSW5saW5lQ29kZS5mcm9tSW5saW5lKGBcbiAgICAgICAgLy8gVGhlIGJlZm9yZSBzdGVwXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiByZXF1ZXN0KC4uLmFyZ3MpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhhcmdzKTtcbiAgICAgICAgICByZXR1cm4ge31cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZSBhZnRlciBzdGVwXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiByZXNwb25zZShjdHgpIHtcbiAgICAgICAgICByZXR1cm4gY3R4LnByZXYucmVzdWx0XG4gICAgICAgIH1cbiAgICBgKTtcblxuICAgIGNvbnN0IGFkZF9pdGVtX3RvX2NhcnQgPSBuZXcgYXBwc3luYy5BcHBzeW5jRnVuY3Rpb24oXG4gICAgICB0aGlzLFxuICAgICAgXCJhZGRfaXRlbV90b19jYXJ0MVwiLFxuICAgICAge1xuICAgICAgICBuYW1lOiBcImFkZF9pdGVtX3RvX0NhcnQxXCIsXG4gICAgICAgIGFwaTogcHJvcHMuYXBpLFxuICAgICAgICBkYXRhU291cmNlOiBPcmRlcnNEUyxcbiAgICAgICAgY29kZTogYXBwc3luYy5Db2RlLmZyb21Bc3NldChcInNyYy9tdXRhdGlvbnMvYWRkSXRlbVRvQ2FydC5qc1wiKSxcbiAgICAgICAgcnVudGltZTogYXBwc3luYy5GdW5jdGlvblJ1bnRpbWUuSlNfMV8wXzAsXG4gICAgICB9XG4gICAgKTtcbiAgICBjb25zdCBwbGFjZV9vcmRlciA9IG5ldyBhcHBzeW5jLkFwcHN5bmNGdW5jdGlvbih0aGlzLCBcInBsYWNlX29yZGVyXCIsIHtcbiAgICAgIG5hbWU6IFwicGxhY2Vfb3JkZXJcIixcbiAgICAgIGFwaTogcHJvcHMuYXBpLFxuICAgICAgZGF0YVNvdXJjZTogT3JkZXJzRFMsXG4gICAgICBjb2RlOiBhcHBzeW5jLkNvZGUuZnJvbUFzc2V0KFwic3JjL211dGF0aW9ucy9wbGFjZU9yZGVyLmpzXCIpLFxuICAgICAgcnVudGltZTogYXBwc3luYy5GdW5jdGlvblJ1bnRpbWUuSlNfMV8wXzAsXG4gICAgfSk7XG5cbiAgICBuZXcgT3JkZXJBcHBTeW5jUmVzb2x2ZXJTdGFjayh0aGlzLCBcIkFwcFN5bmNSZXNvbHZlclN0YWNrXCIsIHtcbiAgICAgIGFkZF9pdGVtX3RvX2NhcnRfZnVuYzogYWRkX2l0ZW1fdG9fY2FydCxcbiAgICAgIHBsYWNlX29yZGVyX2Z1bmM6IHBsYWNlX29yZGVyLFxuICAgICAgYXBpOiBwcm9wcy5hcGksXG4gICAgICBwYXNzdGhyb3VnaDogcGFzc3Rocm91Z2gsXG4gICAgICBlbnY6IHsgYWNjb3VudDogXCIxMzIyNjAyNTMyODVcIiwgcmVnaW9uOiBcImV1LXdlc3QtMVwiIH0sXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==