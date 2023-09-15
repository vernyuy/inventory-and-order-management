"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAppsyncFuncStack = void 0;
const cdk = require("aws-cdk-lib");
const appsync = require("aws-cdk-lib/aws-appsync");
const get_appsync_resolver_1 = require("./get-appsync-resolver");
class GetAppsyncFuncStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // const OrdersDS = props.api.addDynamoDbDataSource(
        //   "Order_data_source",
        //   props.orders_table
        // );
        const inventoryDS = props.api.addDynamoDbDataSource("inventory_data", props.inventory_table);
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
        const getUserInventoriesFunc = new appsync.AppsyncFunction(this, "getUserInventories", {
            name: "getUserInventoriesFunc",
            api: props.api,
            dataSource: inventoryDS,
            code: appsync.Code.fromAsset("src/queries/getUserInventories.js"
            // join(__dirname, '/getUserInventories.js')
            ),
            runtime: appsync.FunctionRuntime.JS_1_0_0,
        });
        const get_user_func = new appsync.AppsyncFunction(this, "get_user", {
            name: "get_user_func",
            api: props.api,
            dataSource: inventoryDS,
            code: appsync.Code.fromAsset("src/queries/getEmployees.js"),
            runtime: appsync.FunctionRuntime.JS_1_0_0,
        });
        const get_inventories = new appsync.AppsyncFunction(this, "func-get-inventories", {
            name: "get_inventories_function",
            api: props.api,
            dataSource: inventoryDS,
            code: appsync.Code.fromAsset("src/queries/getInventories.js"),
            runtime: appsync.FunctionRuntime.JS_1_0_0,
        });
        const get_items = new appsync.AppsyncFunction(this, "func-get-items", {
            name: "get_items_func",
            api: props.api,
            dataSource: inventoryDS,
            code: appsync.Code.fromAsset("src/queries/getItems.js"),
            runtime: appsync.FunctionRuntime.JS_1_0_0,
        });
        const get_inentory_items = new appsync.AppsyncFunction(this, "get-inventory-items", {
            name: "inventory_items_func",
            api: props.api,
            dataSource: inventoryDS,
            code: appsync.Code.fromAsset("src/queries/getInventoryItems.js"),
            runtime: appsync.FunctionRuntime.JS_1_0_0,
        });
        new get_appsync_resolver_1.GetAppsyncResolveStack(this, "get-inventory-items-resolver", {
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
exports.GetAppsyncFuncStack = GetAppsyncFuncStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWFwcHN5bmMtZnVuYy1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdldC1hcHBzeW5jLWZ1bmMtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBR25DLG1EQUFtRDtBQUNuRCxpRUFBZ0U7QUFNaEUsTUFBYSxtQkFBb0IsU0FBUSxHQUFHLENBQUMsS0FBSztJQUNoRCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQStCO1FBQ3ZFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLG9EQUFvRDtRQUNwRCx5QkFBeUI7UUFDekIsdUJBQXVCO1FBQ3ZCLEtBQUs7UUFFTCxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUNqRCxnQkFBZ0IsRUFDaEIsS0FBSyxDQUFDLGVBQWUsQ0FDdEIsQ0FBQztRQUVGLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDOzs7Ozs7Ozs7OztLQVdqRCxDQUFDLENBQUM7UUFFSCxNQUFNLHNCQUFzQixHQUFHLElBQUksT0FBTyxDQUFDLGVBQWUsQ0FDeEQsSUFBSSxFQUNKLG9CQUFvQixFQUNwQjtZQUNFLElBQUksRUFBRSx3QkFBd0I7WUFDOUIsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO1lBQ2QsVUFBVSxFQUFFLFdBQVc7WUFDdkIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUMxQixtQ0FBbUM7WUFDbkMsNENBQTRDO2FBQzdDO1lBQ0QsT0FBTyxFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsUUFBUTtTQUMxQyxDQUNGLENBQUM7UUFFRixNQUFNLGFBQWEsR0FBRyxJQUFJLE9BQU8sQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNsRSxJQUFJLEVBQUUsZUFBZTtZQUNyQixHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7WUFDZCxVQUFVLEVBQUUsV0FBVztZQUN2QixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsNkJBQTZCLENBQUM7WUFDM0QsT0FBTyxFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsUUFBUTtTQUMxQyxDQUFDLENBQUM7UUFFSCxNQUFNLGVBQWUsR0FBRyxJQUFJLE9BQU8sQ0FBQyxlQUFlLENBQ2pELElBQUksRUFDSixzQkFBc0IsRUFDdEI7WUFDRSxJQUFJLEVBQUUsMEJBQTBCO1lBQ2hDLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztZQUNkLFVBQVUsRUFBRSxXQUFXO1lBQ3ZCLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQywrQkFBK0IsQ0FBQztZQUM3RCxPQUFPLEVBQUUsT0FBTyxDQUFDLGVBQWUsQ0FBQyxRQUFRO1NBQzFDLENBQ0YsQ0FBQztRQUVGLE1BQU0sU0FBUyxHQUFHLElBQUksT0FBTyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7WUFDcEUsSUFBSSxFQUFFLGdCQUFnQjtZQUN0QixHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7WUFDZCxVQUFVLEVBQUUsV0FBVztZQUN2QixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMseUJBQXlCLENBQUM7WUFDdkQsT0FBTyxFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsUUFBUTtTQUMxQyxDQUFDLENBQUM7UUFFSCxNQUFNLGtCQUFrQixHQUFHLElBQUksT0FBTyxDQUFDLGVBQWUsQ0FDcEQsSUFBSSxFQUNKLHFCQUFxQixFQUNyQjtZQUNFLElBQUksRUFBRSxzQkFBc0I7WUFDNUIsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO1lBQ2QsVUFBVSxFQUFFLFdBQVc7WUFDdkIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGtDQUFrQyxDQUFDO1lBQ2hFLE9BQU8sRUFBRSxPQUFPLENBQUMsZUFBZSxDQUFDLFFBQVE7U0FDMUMsQ0FDRixDQUFDO1FBRUYsSUFBSSw2Q0FBc0IsQ0FBQyxJQUFJLEVBQUUsOEJBQThCLEVBQUU7WUFDL0Qsb0JBQW9CLEVBQUUsZUFBZTtZQUNyQyx3QkFBd0IsRUFBRSxrQkFBa0I7WUFDNUMsY0FBYyxFQUFFLFNBQVM7WUFDekIseUJBQXlCLEVBQUUsc0JBQXNCO1lBQ2pELGNBQWMsRUFBRSxhQUFhO1lBQzdCLFdBQVcsRUFBRSxXQUFXO1lBQ3hCLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztZQUNkLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFO1NBQ3BELENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQTdGRCxrREE2RkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSBcImF3cy1jZGstbGliXCI7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tIFwiY29uc3RydWN0c1wiO1xuaW1wb3J0ICogYXMgZHluYW1vZGIgZnJvbSBcImF3cy1jZGstbGliL2F3cy1keW5hbW9kYlwiO1xuaW1wb3J0ICogYXMgYXBwc3luYyBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWFwcHN5bmNcIjtcbmltcG9ydCB7IEdldEFwcHN5bmNSZXNvbHZlU3RhY2sgfSBmcm9tIFwiLi9nZXQtYXBwc3luYy1yZXNvbHZlclwiO1xuXG5pbnRlcmZhY2UgR2V0QXBwc3luY0Z1bmNTdGFja1Byb3BzIGV4dGVuZHMgY2RrLlN0YWNrUHJvcHMge1xuICBpbnZlbnRvcnlfdGFibGU6IGR5bmFtb2RiLlRhYmxlO1xuICBhcGk6IGFwcHN5bmMuR3JhcGhxbEFwaTtcbn1cbmV4cG9ydCBjbGFzcyBHZXRBcHBzeW5jRnVuY1N0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEdldEFwcHN5bmNGdW5jU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgLy8gY29uc3QgT3JkZXJzRFMgPSBwcm9wcy5hcGkuYWRkRHluYW1vRGJEYXRhU291cmNlKFxuICAgIC8vICAgXCJPcmRlcl9kYXRhX3NvdXJjZVwiLFxuICAgIC8vICAgcHJvcHMub3JkZXJzX3RhYmxlXG4gICAgLy8gKTtcblxuICAgIGNvbnN0IGludmVudG9yeURTID0gcHJvcHMuYXBpLmFkZER5bmFtb0RiRGF0YVNvdXJjZShcbiAgICAgIFwiaW52ZW50b3J5X2RhdGFcIixcbiAgICAgIHByb3BzLmludmVudG9yeV90YWJsZVxuICAgICk7XG5cbiAgICBjb25zdCBwYXNzdGhyb3VnaCA9IGFwcHN5bmMuSW5saW5lQ29kZS5mcm9tSW5saW5lKGBcbiAgICAgICAgLy8gVGhlIGJlZm9yZSBzdGVwXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiByZXF1ZXN0KC4uLmFyZ3MpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhhcmdzKTtcbiAgICAgICAgICByZXR1cm4ge31cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZSBhZnRlciBzdGVwXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiByZXNwb25zZShjdHgpIHtcbiAgICAgICAgICByZXR1cm4gY3R4LnByZXYucmVzdWx0XG4gICAgICAgIH1cbiAgICBgKTtcblxuICAgIGNvbnN0IGdldFVzZXJJbnZlbnRvcmllc0Z1bmMgPSBuZXcgYXBwc3luYy5BcHBzeW5jRnVuY3Rpb24oXG4gICAgICB0aGlzLFxuICAgICAgXCJnZXRVc2VySW52ZW50b3JpZXNcIixcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJnZXRVc2VySW52ZW50b3JpZXNGdW5jXCIsXG4gICAgICAgIGFwaTogcHJvcHMuYXBpLFxuICAgICAgICBkYXRhU291cmNlOiBpbnZlbnRvcnlEUyxcbiAgICAgICAgY29kZTogYXBwc3luYy5Db2RlLmZyb21Bc3NldChcbiAgICAgICAgICBcInNyYy9xdWVyaWVzL2dldFVzZXJJbnZlbnRvcmllcy5qc1wiXG4gICAgICAgICAgLy8gam9pbihfX2Rpcm5hbWUsICcvZ2V0VXNlckludmVudG9yaWVzLmpzJylcbiAgICAgICAgKSxcbiAgICAgICAgcnVudGltZTogYXBwc3luYy5GdW5jdGlvblJ1bnRpbWUuSlNfMV8wXzAsXG4gICAgICB9XG4gICAgKTtcblxuICAgIGNvbnN0IGdldF91c2VyX2Z1bmMgPSBuZXcgYXBwc3luYy5BcHBzeW5jRnVuY3Rpb24odGhpcywgXCJnZXRfdXNlclwiLCB7XG4gICAgICBuYW1lOiBcImdldF91c2VyX2Z1bmNcIixcbiAgICAgIGFwaTogcHJvcHMuYXBpLFxuICAgICAgZGF0YVNvdXJjZTogaW52ZW50b3J5RFMsXG4gICAgICBjb2RlOiBhcHBzeW5jLkNvZGUuZnJvbUFzc2V0KFwic3JjL3F1ZXJpZXMvZ2V0RW1wbG95ZWVzLmpzXCIpLFxuICAgICAgcnVudGltZTogYXBwc3luYy5GdW5jdGlvblJ1bnRpbWUuSlNfMV8wXzAsXG4gICAgfSk7XG5cbiAgICBjb25zdCBnZXRfaW52ZW50b3JpZXMgPSBuZXcgYXBwc3luYy5BcHBzeW5jRnVuY3Rpb24oXG4gICAgICB0aGlzLFxuICAgICAgXCJmdW5jLWdldC1pbnZlbnRvcmllc1wiLFxuICAgICAge1xuICAgICAgICBuYW1lOiBcImdldF9pbnZlbnRvcmllc19mdW5jdGlvblwiLFxuICAgICAgICBhcGk6IHByb3BzLmFwaSxcbiAgICAgICAgZGF0YVNvdXJjZTogaW52ZW50b3J5RFMsXG4gICAgICAgIGNvZGU6IGFwcHN5bmMuQ29kZS5mcm9tQXNzZXQoXCJzcmMvcXVlcmllcy9nZXRJbnZlbnRvcmllcy5qc1wiKSxcbiAgICAgICAgcnVudGltZTogYXBwc3luYy5GdW5jdGlvblJ1bnRpbWUuSlNfMV8wXzAsXG4gICAgICB9XG4gICAgKTtcblxuICAgIGNvbnN0IGdldF9pdGVtcyA9IG5ldyBhcHBzeW5jLkFwcHN5bmNGdW5jdGlvbih0aGlzLCBcImZ1bmMtZ2V0LWl0ZW1zXCIsIHtcbiAgICAgIG5hbWU6IFwiZ2V0X2l0ZW1zX2Z1bmNcIixcbiAgICAgIGFwaTogcHJvcHMuYXBpLFxuICAgICAgZGF0YVNvdXJjZTogaW52ZW50b3J5RFMsXG4gICAgICBjb2RlOiBhcHBzeW5jLkNvZGUuZnJvbUFzc2V0KFwic3JjL3F1ZXJpZXMvZ2V0SXRlbXMuanNcIiksXG4gICAgICBydW50aW1lOiBhcHBzeW5jLkZ1bmN0aW9uUnVudGltZS5KU18xXzBfMCxcbiAgICB9KTtcblxuICAgIGNvbnN0IGdldF9pbmVudG9yeV9pdGVtcyA9IG5ldyBhcHBzeW5jLkFwcHN5bmNGdW5jdGlvbihcbiAgICAgIHRoaXMsXG4gICAgICBcImdldC1pbnZlbnRvcnktaXRlbXNcIixcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJpbnZlbnRvcnlfaXRlbXNfZnVuY1wiLFxuICAgICAgICBhcGk6IHByb3BzLmFwaSxcbiAgICAgICAgZGF0YVNvdXJjZTogaW52ZW50b3J5RFMsXG4gICAgICAgIGNvZGU6IGFwcHN5bmMuQ29kZS5mcm9tQXNzZXQoXCJzcmMvcXVlcmllcy9nZXRJbnZlbnRvcnlJdGVtcy5qc1wiKSxcbiAgICAgICAgcnVudGltZTogYXBwc3luYy5GdW5jdGlvblJ1bnRpbWUuSlNfMV8wXzAsXG4gICAgICB9XG4gICAgKTtcblxuICAgIG5ldyBHZXRBcHBzeW5jUmVzb2x2ZVN0YWNrKHRoaXMsIFwiZ2V0LWludmVudG9yeS1pdGVtcy1yZXNvbHZlclwiLCB7XG4gICAgICBnZXRfaW52ZW50b3JpZXNfZnVuYzogZ2V0X2ludmVudG9yaWVzLFxuICAgICAgZ2V0X2ludmVudG9yeV9pdGVtc19mdW5jOiBnZXRfaW5lbnRvcnlfaXRlbXMsXG4gICAgICBnZXRfaXRlbXNfZnVuYzogZ2V0X2l0ZW1zLFxuICAgICAgZ2V0X3VzZXJfaW52ZW50b3JpZXNfZnVuYzogZ2V0VXNlckludmVudG9yaWVzRnVuYyxcbiAgICAgIGdldF91c2Vyc19mdW5jOiBnZXRfdXNlcl9mdW5jLFxuICAgICAgcGFzc3Rocm91Z2g6IHBhc3N0aHJvdWdoLFxuICAgICAgYXBpOiBwcm9wcy5hcGksXG4gICAgICBlbnY6IHsgYWNjb3VudDogdGhpcy5hY2NvdW50LCByZWdpb246IHRoaXMucmVnaW9uIH0sXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==