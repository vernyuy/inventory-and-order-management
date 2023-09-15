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
            env: { account: "132260253285", region: "eu-west-1" },
        });
    }
}
exports.GetAppsyncFuncStack = GetAppsyncFuncStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWFwcHN5bmMtZnVuYy1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdldC1hcHBzeW5jLWZ1bmMtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBR25DLG1EQUFtRDtBQUNuRCxpRUFBZ0U7QUFNaEUsTUFBYSxtQkFBb0IsU0FBUSxHQUFHLENBQUMsS0FBSztJQUNoRCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQStCO1FBQ3ZFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLG9EQUFvRDtRQUNwRCx5QkFBeUI7UUFDekIsdUJBQXVCO1FBQ3ZCLEtBQUs7UUFFTCxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUNqRCxnQkFBZ0IsRUFDaEIsS0FBSyxDQUFDLGVBQWUsQ0FDdEIsQ0FBQztRQUVGLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDOzs7Ozs7Ozs7OztLQVdqRCxDQUFDLENBQUM7UUFFSCxNQUFNLHNCQUFzQixHQUFHLElBQUksT0FBTyxDQUFDLGVBQWUsQ0FDeEQsSUFBSSxFQUNKLG9CQUFvQixFQUNwQjtZQUNFLElBQUksRUFBRSx3QkFBd0I7WUFDOUIsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO1lBQ2QsVUFBVSxFQUFFLFdBQVc7WUFDdkIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUMxQixtQ0FBbUM7WUFDbkMsNENBQTRDO2FBQzdDO1lBQ0QsT0FBTyxFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsUUFBUTtTQUMxQyxDQUNGLENBQUM7UUFFRixNQUFNLGFBQWEsR0FBRyxJQUFJLE9BQU8sQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNsRSxJQUFJLEVBQUUsZUFBZTtZQUNyQixHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7WUFDZCxVQUFVLEVBQUUsV0FBVztZQUN2QixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsNkJBQTZCLENBQUM7WUFDM0QsT0FBTyxFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsUUFBUTtTQUMxQyxDQUFDLENBQUM7UUFFSCxNQUFNLGVBQWUsR0FBRyxJQUFJLE9BQU8sQ0FBQyxlQUFlLENBQ2pELElBQUksRUFDSixzQkFBc0IsRUFDdEI7WUFDRSxJQUFJLEVBQUUsMEJBQTBCO1lBQ2hDLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztZQUNkLFVBQVUsRUFBRSxXQUFXO1lBQ3ZCLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQywrQkFBK0IsQ0FBQztZQUM3RCxPQUFPLEVBQUUsT0FBTyxDQUFDLGVBQWUsQ0FBQyxRQUFRO1NBQzFDLENBQ0YsQ0FBQztRQUVGLE1BQU0sU0FBUyxHQUFHLElBQUksT0FBTyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7WUFDcEUsSUFBSSxFQUFFLGdCQUFnQjtZQUN0QixHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7WUFDZCxVQUFVLEVBQUUsV0FBVztZQUN2QixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMseUJBQXlCLENBQUM7WUFDdkQsT0FBTyxFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsUUFBUTtTQUMxQyxDQUFDLENBQUM7UUFFSCxNQUFNLGtCQUFrQixHQUFHLElBQUksT0FBTyxDQUFDLGVBQWUsQ0FDcEQsSUFBSSxFQUNKLHFCQUFxQixFQUNyQjtZQUNFLElBQUksRUFBRSxzQkFBc0I7WUFDNUIsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO1lBQ2QsVUFBVSxFQUFFLFdBQVc7WUFDdkIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGtDQUFrQyxDQUFDO1lBQ2hFLE9BQU8sRUFBRSxPQUFPLENBQUMsZUFBZSxDQUFDLFFBQVE7U0FDMUMsQ0FDRixDQUFDO1FBRUYsSUFBSSw2Q0FBc0IsQ0FBQyxJQUFJLEVBQUUsOEJBQThCLEVBQUU7WUFDL0Qsb0JBQW9CLEVBQUUsZUFBZTtZQUNyQyx3QkFBd0IsRUFBRSxrQkFBa0I7WUFDNUMsY0FBYyxFQUFFLFNBQVM7WUFDekIseUJBQXlCLEVBQUUsc0JBQXNCO1lBQ2pELGNBQWMsRUFBRSxhQUFhO1lBQzdCLFdBQVcsRUFBRSxXQUFXO1lBQ3hCLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztZQUNkLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRTtTQUN0RCxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUE3RkQsa0RBNkZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gXCJhd3MtY2RrLWxpYlwiO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSBcImNvbnN0cnVjdHNcIjtcbmltcG9ydCAqIGFzIGR5bmFtb2RiIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtZHluYW1vZGJcIjtcbmltcG9ydCAqIGFzIGFwcHN5bmMgZnJvbSBcImF3cy1jZGstbGliL2F3cy1hcHBzeW5jXCI7XG5pbXBvcnQgeyBHZXRBcHBzeW5jUmVzb2x2ZVN0YWNrIH0gZnJvbSBcIi4vZ2V0LWFwcHN5bmMtcmVzb2x2ZXJcIjtcblxuaW50ZXJmYWNlIEdldEFwcHN5bmNGdW5jU3RhY2tQcm9wcyBleHRlbmRzIGNkay5TdGFja1Byb3BzIHtcbiAgaW52ZW50b3J5X3RhYmxlOiBkeW5hbW9kYi5UYWJsZTtcbiAgYXBpOiBhcHBzeW5jLkdyYXBocWxBcGk7XG59XG5leHBvcnQgY2xhc3MgR2V0QXBwc3luY0Z1bmNTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBHZXRBcHBzeW5jRnVuY1N0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIC8vIGNvbnN0IE9yZGVyc0RTID0gcHJvcHMuYXBpLmFkZER5bmFtb0RiRGF0YVNvdXJjZShcbiAgICAvLyAgIFwiT3JkZXJfZGF0YV9zb3VyY2VcIixcbiAgICAvLyAgIHByb3BzLm9yZGVyc190YWJsZVxuICAgIC8vICk7XG5cbiAgICBjb25zdCBpbnZlbnRvcnlEUyA9IHByb3BzLmFwaS5hZGREeW5hbW9EYkRhdGFTb3VyY2UoXG4gICAgICBcImludmVudG9yeV9kYXRhXCIsXG4gICAgICBwcm9wcy5pbnZlbnRvcnlfdGFibGVcbiAgICApO1xuXG4gICAgY29uc3QgcGFzc3Rocm91Z2ggPSBhcHBzeW5jLklubGluZUNvZGUuZnJvbUlubGluZShgXG4gICAgICAgIC8vIFRoZSBiZWZvcmUgc3RlcFxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gcmVxdWVzdCguLi5hcmdzKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coYXJncyk7XG4gICAgICAgICAgcmV0dXJuIHt9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgYWZ0ZXIgc3RlcFxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gcmVzcG9uc2UoY3R4KSB7XG4gICAgICAgICAgcmV0dXJuIGN0eC5wcmV2LnJlc3VsdFxuICAgICAgICB9XG4gICAgYCk7XG5cbiAgICBjb25zdCBnZXRVc2VySW52ZW50b3JpZXNGdW5jID0gbmV3IGFwcHN5bmMuQXBwc3luY0Z1bmN0aW9uKFxuICAgICAgdGhpcyxcbiAgICAgIFwiZ2V0VXNlckludmVudG9yaWVzXCIsXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiZ2V0VXNlckludmVudG9yaWVzRnVuY1wiLFxuICAgICAgICBhcGk6IHByb3BzLmFwaSxcbiAgICAgICAgZGF0YVNvdXJjZTogaW52ZW50b3J5RFMsXG4gICAgICAgIGNvZGU6IGFwcHN5bmMuQ29kZS5mcm9tQXNzZXQoXG4gICAgICAgICAgXCJzcmMvcXVlcmllcy9nZXRVc2VySW52ZW50b3JpZXMuanNcIlxuICAgICAgICAgIC8vIGpvaW4oX19kaXJuYW1lLCAnL2dldFVzZXJJbnZlbnRvcmllcy5qcycpXG4gICAgICAgICksXG4gICAgICAgIHJ1bnRpbWU6IGFwcHN5bmMuRnVuY3Rpb25SdW50aW1lLkpTXzFfMF8wLFxuICAgICAgfVxuICAgICk7XG5cbiAgICBjb25zdCBnZXRfdXNlcl9mdW5jID0gbmV3IGFwcHN5bmMuQXBwc3luY0Z1bmN0aW9uKHRoaXMsIFwiZ2V0X3VzZXJcIiwge1xuICAgICAgbmFtZTogXCJnZXRfdXNlcl9mdW5jXCIsXG4gICAgICBhcGk6IHByb3BzLmFwaSxcbiAgICAgIGRhdGFTb3VyY2U6IGludmVudG9yeURTLFxuICAgICAgY29kZTogYXBwc3luYy5Db2RlLmZyb21Bc3NldChcInNyYy9xdWVyaWVzL2dldEVtcGxveWVlcy5qc1wiKSxcbiAgICAgIHJ1bnRpbWU6IGFwcHN5bmMuRnVuY3Rpb25SdW50aW1lLkpTXzFfMF8wLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZ2V0X2ludmVudG9yaWVzID0gbmV3IGFwcHN5bmMuQXBwc3luY0Z1bmN0aW9uKFxuICAgICAgdGhpcyxcbiAgICAgIFwiZnVuYy1nZXQtaW52ZW50b3JpZXNcIixcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJnZXRfaW52ZW50b3JpZXNfZnVuY3Rpb25cIixcbiAgICAgICAgYXBpOiBwcm9wcy5hcGksXG4gICAgICAgIGRhdGFTb3VyY2U6IGludmVudG9yeURTLFxuICAgICAgICBjb2RlOiBhcHBzeW5jLkNvZGUuZnJvbUFzc2V0KFwic3JjL3F1ZXJpZXMvZ2V0SW52ZW50b3JpZXMuanNcIiksXG4gICAgICAgIHJ1bnRpbWU6IGFwcHN5bmMuRnVuY3Rpb25SdW50aW1lLkpTXzFfMF8wLFxuICAgICAgfVxuICAgICk7XG5cbiAgICBjb25zdCBnZXRfaXRlbXMgPSBuZXcgYXBwc3luYy5BcHBzeW5jRnVuY3Rpb24odGhpcywgXCJmdW5jLWdldC1pdGVtc1wiLCB7XG4gICAgICBuYW1lOiBcImdldF9pdGVtc19mdW5jXCIsXG4gICAgICBhcGk6IHByb3BzLmFwaSxcbiAgICAgIGRhdGFTb3VyY2U6IGludmVudG9yeURTLFxuICAgICAgY29kZTogYXBwc3luYy5Db2RlLmZyb21Bc3NldChcInNyYy9xdWVyaWVzL2dldEl0ZW1zLmpzXCIpLFxuICAgICAgcnVudGltZTogYXBwc3luYy5GdW5jdGlvblJ1bnRpbWUuSlNfMV8wXzAsXG4gICAgfSk7XG5cbiAgICBjb25zdCBnZXRfaW5lbnRvcnlfaXRlbXMgPSBuZXcgYXBwc3luYy5BcHBzeW5jRnVuY3Rpb24oXG4gICAgICB0aGlzLFxuICAgICAgXCJnZXQtaW52ZW50b3J5LWl0ZW1zXCIsXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiaW52ZW50b3J5X2l0ZW1zX2Z1bmNcIixcbiAgICAgICAgYXBpOiBwcm9wcy5hcGksXG4gICAgICAgIGRhdGFTb3VyY2U6IGludmVudG9yeURTLFxuICAgICAgICBjb2RlOiBhcHBzeW5jLkNvZGUuZnJvbUFzc2V0KFwic3JjL3F1ZXJpZXMvZ2V0SW52ZW50b3J5SXRlbXMuanNcIiksXG4gICAgICAgIHJ1bnRpbWU6IGFwcHN5bmMuRnVuY3Rpb25SdW50aW1lLkpTXzFfMF8wLFxuICAgICAgfVxuICAgICk7XG5cbiAgICBuZXcgR2V0QXBwc3luY1Jlc29sdmVTdGFjayh0aGlzLCBcImdldC1pbnZlbnRvcnktaXRlbXMtcmVzb2x2ZXJcIiwge1xuICAgICAgZ2V0X2ludmVudG9yaWVzX2Z1bmM6IGdldF9pbnZlbnRvcmllcyxcbiAgICAgIGdldF9pbnZlbnRvcnlfaXRlbXNfZnVuYzogZ2V0X2luZW50b3J5X2l0ZW1zLFxuICAgICAgZ2V0X2l0ZW1zX2Z1bmM6IGdldF9pdGVtcyxcbiAgICAgIGdldF91c2VyX2ludmVudG9yaWVzX2Z1bmM6IGdldFVzZXJJbnZlbnRvcmllc0Z1bmMsXG4gICAgICBnZXRfdXNlcnNfZnVuYzogZ2V0X3VzZXJfZnVuYyxcbiAgICAgIHBhc3N0aHJvdWdoOiBwYXNzdGhyb3VnaCxcbiAgICAgIGFwaTogcHJvcHMuYXBpLFxuICAgICAgZW52OiB7IGFjY291bnQ6IFwiMTMyMjYwMjUzMjg1XCIsIHJlZ2lvbjogXCJldS13ZXN0LTFcIiB9LFxuICAgIH0pO1xuICB9XG59XG4iXX0=