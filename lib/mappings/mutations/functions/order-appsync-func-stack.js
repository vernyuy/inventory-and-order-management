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
            env: { account: this.account, region: this.region },
        });
    }
}
exports.OrderAppsyncFuncStack = OrderAppsyncFuncStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXItYXBwc3luYy1mdW5jLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsib3JkZXItYXBwc3luYy1mdW5jLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFtQztBQUduQyxtREFBbUQ7QUFDbkQsNEZBQXNGO0FBTXRGLE1BQWEscUJBQXNCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDbEQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFpQztRQUN6RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUM5QyxtQkFBbUIsRUFDbkIsS0FBSyxDQUFDLFlBQVksQ0FDbkIsQ0FBQztRQUVGLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDOzs7Ozs7Ozs7OztLQVdqRCxDQUFDLENBQUM7UUFFSCxNQUFNLGdCQUFnQixHQUFHLElBQUksT0FBTyxDQUFDLGVBQWUsQ0FDbEQsSUFBSSxFQUNKLG1CQUFtQixFQUNuQjtZQUNFLElBQUksRUFBRSxtQkFBbUI7WUFDekIsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO1lBQ2QsVUFBVSxFQUFFLFFBQVE7WUFDcEIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGdDQUFnQyxDQUFDO1lBQzlELE9BQU8sRUFBRSxPQUFPLENBQUMsZUFBZSxDQUFDLFFBQVE7U0FDMUMsQ0FDRixDQUFDO1FBQ0YsTUFBTSxXQUFXLEdBQUcsSUFBSSxPQUFPLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDbkUsSUFBSSxFQUFFLGFBQWE7WUFDbkIsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO1lBQ2QsVUFBVSxFQUFFLFFBQVE7WUFDcEIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLDZCQUE2QixDQUFDO1lBQzNELE9BQU8sRUFBRSxPQUFPLENBQUMsZUFBZSxDQUFDLFFBQVE7U0FDMUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSx3REFBeUIsQ0FBQyxJQUFJLEVBQUUsc0JBQXNCLEVBQUU7WUFDMUQscUJBQXFCLEVBQUUsZ0JBQWdCO1lBQ3ZDLGdCQUFnQixFQUFFLFdBQVc7WUFDN0IsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO1lBQ2QsV0FBVyxFQUFFLFdBQVc7WUFDeEIsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUU7U0FDcEQsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBakRELHNEQWlEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tIFwiYXdzLWNkay1saWJcIjtcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJjb25zdHJ1Y3RzXCI7XG5pbXBvcnQgKiBhcyBkeW5hbW9kYiBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWR5bmFtb2RiXCI7XG5pbXBvcnQgKiBhcyBhcHBzeW5jIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtYXBwc3luY1wiO1xuaW1wb3J0IHsgT3JkZXJBcHBTeW5jUmVzb2x2ZXJTdGFjayB9IGZyb20gXCIuLi9yZXNvbHZlcnMvb3JkZXItYXBwc3luYy1yZXNvbHZlci1zdGFja1wiO1xuXG5pbnRlcmZhY2UgT3JkZXJBcHBzeW5jRnVuY1N0YWNrUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XG4gIG9yZGVyc190YWJsZTogZHluYW1vZGIuVGFibGU7XG4gIGFwaTogYXBwc3luYy5HcmFwaHFsQXBpO1xufVxuZXhwb3J0IGNsYXNzIE9yZGVyQXBwc3luY0Z1bmNTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBPcmRlckFwcHN5bmNGdW5jU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgT3JkZXJzRFMgPSBwcm9wcy5hcGkuYWRkRHluYW1vRGJEYXRhU291cmNlKFxuICAgICAgXCJPcmRlcl9kYXRhX3NvdXJjZVwiLFxuICAgICAgcHJvcHMub3JkZXJzX3RhYmxlXG4gICAgKTtcblxuICAgIGNvbnN0IHBhc3N0aHJvdWdoID0gYXBwc3luYy5JbmxpbmVDb2RlLmZyb21JbmxpbmUoYFxuICAgICAgICAvLyBUaGUgYmVmb3JlIHN0ZXBcbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIHJlcXVlc3QoLi4uYXJncykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGFyZ3MpO1xuICAgICAgICAgIHJldHVybiB7fVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIGFmdGVyIHN0ZXBcbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIHJlc3BvbnNlKGN0eCkge1xuICAgICAgICAgIHJldHVybiBjdHgucHJldi5yZXN1bHRcbiAgICAgICAgfVxuICAgIGApO1xuXG4gICAgY29uc3QgYWRkX2l0ZW1fdG9fY2FydCA9IG5ldyBhcHBzeW5jLkFwcHN5bmNGdW5jdGlvbihcbiAgICAgIHRoaXMsXG4gICAgICBcImFkZF9pdGVtX3RvX2NhcnQxXCIsXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiYWRkX2l0ZW1fdG9fQ2FydDFcIixcbiAgICAgICAgYXBpOiBwcm9wcy5hcGksXG4gICAgICAgIGRhdGFTb3VyY2U6IE9yZGVyc0RTLFxuICAgICAgICBjb2RlOiBhcHBzeW5jLkNvZGUuZnJvbUFzc2V0KFwic3JjL211dGF0aW9ucy9hZGRJdGVtVG9DYXJ0LmpzXCIpLFxuICAgICAgICBydW50aW1lOiBhcHBzeW5jLkZ1bmN0aW9uUnVudGltZS5KU18xXzBfMCxcbiAgICAgIH1cbiAgICApO1xuICAgIGNvbnN0IHBsYWNlX29yZGVyID0gbmV3IGFwcHN5bmMuQXBwc3luY0Z1bmN0aW9uKHRoaXMsIFwicGxhY2Vfb3JkZXJcIiwge1xuICAgICAgbmFtZTogXCJwbGFjZV9vcmRlclwiLFxuICAgICAgYXBpOiBwcm9wcy5hcGksXG4gICAgICBkYXRhU291cmNlOiBPcmRlcnNEUyxcbiAgICAgIGNvZGU6IGFwcHN5bmMuQ29kZS5mcm9tQXNzZXQoXCJzcmMvbXV0YXRpb25zL3BsYWNlT3JkZXIuanNcIiksXG4gICAgICBydW50aW1lOiBhcHBzeW5jLkZ1bmN0aW9uUnVudGltZS5KU18xXzBfMCxcbiAgICB9KTtcblxuICAgIG5ldyBPcmRlckFwcFN5bmNSZXNvbHZlclN0YWNrKHRoaXMsIFwiQXBwU3luY1Jlc29sdmVyU3RhY2tcIiwge1xuICAgICAgYWRkX2l0ZW1fdG9fY2FydF9mdW5jOiBhZGRfaXRlbV90b19jYXJ0LFxuICAgICAgcGxhY2Vfb3JkZXJfZnVuYzogcGxhY2Vfb3JkZXIsXG4gICAgICBhcGk6IHByb3BzLmFwaSxcbiAgICAgIHBhc3N0aHJvdWdoOiBwYXNzdGhyb3VnaCxcbiAgICAgIGVudjogeyBhY2NvdW50OiB0aGlzLmFjY291bnQsIHJlZ2lvbjogdGhpcy5yZWdpb24gfSxcbiAgICB9KTtcbiAgfVxufVxuIl19