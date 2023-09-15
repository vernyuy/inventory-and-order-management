"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryAppsyncFuncStack = void 0;
const cdk = require("aws-cdk-lib");
const appsync = require("aws-cdk-lib/aws-appsync");
const inventory_appsync_resolver_1 = require("../resolvers/inventory-appsync-resolver");
class InventoryAppsyncFuncStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const InventoryDS = props.api.addDynamoDbDataSource("inventory_data_source", props.inventories_table);
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
        const add_inventory = new appsync.AppsyncFunction(this, "func-add-inventory", {
            name: "add_inventory",
            api: props.api,
            dataSource: InventoryDS,
            code: appsync.Code.fromAsset("src/mutations/createInventory.js"),
            runtime: appsync.FunctionRuntime.JS_1_0_0,
        });
        new inventory_appsync_resolver_1.InventoryAppsyncResolverStack(this, "InventoryResolver", {
            api: props.api,
            create_inventory_func: add_inventory,
            create_item_func: add_item,
            create_user_func: add_emp,
            passthrough: passthrough,
            env: { account: this.account, region: this.region },
        });
    }
}
exports.InventoryAppsyncFuncStack = InventoryAppsyncFuncStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW52ZW50b3J5LWFwcHN5bmMtZnVuYy1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludmVudG9yeS1hcHBzeW5jLWZ1bmMtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBRW5DLG1EQUFtRDtBQUVuRCx3RkFBd0Y7QUFNeEYsTUFBYSx5QkFBMEIsU0FBUSxHQUFHLENBQUMsS0FBSztJQUN0RCxZQUNFLEtBQWdCLEVBQ2hCLEVBQVUsRUFDVixLQUFxQztRQUVyQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4QixNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUNqRCx1QkFBdUIsRUFDdkIsS0FBSyxDQUFDLGlCQUFpQixDQUN4QixDQUFDO1FBRUYsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUM7Ozs7Ozs7Ozs7O0tBV2pELENBQUMsQ0FBQztRQUNILE1BQU0sT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQ2pFLElBQUksRUFBRSxjQUFjO1lBQ3BCLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztZQUNkLFVBQVUsRUFBRSxXQUFXO1lBQ3ZCLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQ0FBaUMsQ0FBQztZQUMvRCxPQUFPLEVBQUUsT0FBTyxDQUFDLGVBQWUsQ0FBQyxRQUFRO1NBQzFDLENBQUMsQ0FBQztRQUVILE1BQU0sUUFBUSxHQUFHLElBQUksT0FBTyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQ2xFLElBQUksRUFBRSxVQUFVO1lBQ2hCLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztZQUNkLFVBQVUsRUFBRSxXQUFXO1lBQ3ZCLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyw2QkFBNkIsQ0FBQztZQUMzRCxPQUFPLEVBQUUsT0FBTyxDQUFDLGVBQWUsQ0FBQyxRQUFRO1NBQzFDLENBQUMsQ0FBQztRQUVILE1BQU0sYUFBYSxHQUFHLElBQUksT0FBTyxDQUFDLGVBQWUsQ0FDL0MsSUFBSSxFQUNKLG9CQUFvQixFQUNwQjtZQUNFLElBQUksRUFBRSxlQUFlO1lBQ3JCLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztZQUNkLFVBQVUsRUFBRSxXQUFXO1lBQ3ZCLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQ0FBa0MsQ0FBQztZQUNoRSxPQUFPLEVBQUUsT0FBTyxDQUFDLGVBQWUsQ0FBQyxRQUFRO1NBQzFDLENBQ0YsQ0FBQztRQUVGLElBQUksMERBQTZCLENBQUMsSUFBSSxFQUFFLG1CQUFtQixFQUFFO1lBQzNELEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztZQUNkLHFCQUFxQixFQUFFLGFBQWE7WUFDcEMsZ0JBQWdCLEVBQUUsUUFBUTtZQUMxQixnQkFBZ0IsRUFBRSxPQUFPO1lBQ3pCLFdBQVcsRUFBRSxXQUFXO1lBQ3hCLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFO1NBQ3BELENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQTdERCw4REE2REMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSBcImF3cy1jZGstbGliXCI7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tIFwiY29uc3RydWN0c1wiO1xuaW1wb3J0ICogYXMgYXBwc3luYyBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWFwcHN5bmNcIjtcbmltcG9ydCAqIGFzIGR5bmFtb2RiIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtZHluYW1vZGJcIjtcbmltcG9ydCB7IEludmVudG9yeUFwcHN5bmNSZXNvbHZlclN0YWNrIH0gZnJvbSBcIi4uL3Jlc29sdmVycy9pbnZlbnRvcnktYXBwc3luYy1yZXNvbHZlclwiO1xuXG5pbnRlcmZhY2UgSW52ZW50b3J5QXBwc3luY0Z1bmNTdGFja1Byb3BzIGV4dGVuZHMgY2RrLlN0YWNrUHJvcHMge1xuICBpbnZlbnRvcmllc190YWJsZTogZHluYW1vZGIuVGFibGU7XG4gIGFwaTogYXBwc3luYy5HcmFwaHFsQXBpO1xufVxuZXhwb3J0IGNsYXNzIEludmVudG9yeUFwcHN5bmNGdW5jU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihcbiAgICBzY29wZTogQ29uc3RydWN0LFxuICAgIGlkOiBzdHJpbmcsXG4gICAgcHJvcHM6IEludmVudG9yeUFwcHN5bmNGdW5jU3RhY2tQcm9wc1xuICApIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcbiAgICBjb25zdCBJbnZlbnRvcnlEUyA9IHByb3BzLmFwaS5hZGREeW5hbW9EYkRhdGFTb3VyY2UoXG4gICAgICBcImludmVudG9yeV9kYXRhX3NvdXJjZVwiLFxuICAgICAgcHJvcHMuaW52ZW50b3JpZXNfdGFibGVcbiAgICApO1xuXG4gICAgY29uc3QgcGFzc3Rocm91Z2ggPSBhcHBzeW5jLklubGluZUNvZGUuZnJvbUlubGluZShgXG4gICAgICAgIC8vIFRoZSBiZWZvcmUgc3RlcFxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gcmVxdWVzdCguLi5hcmdzKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coYXJncyk7XG4gICAgICAgICAgcmV0dXJuIHt9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgYWZ0ZXIgc3RlcFxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gcmVzcG9uc2UoY3R4KSB7XG4gICAgICAgICAgcmV0dXJuIGN0eC5wcmV2LnJlc3VsdFxuICAgICAgICB9XG4gICAgYCk7XG4gICAgY29uc3QgYWRkX2VtcCA9IG5ldyBhcHBzeW5jLkFwcHN5bmNGdW5jdGlvbih0aGlzLCBcImZ1bmMtYWRkLXBvc3RcIiwge1xuICAgICAgbmFtZTogXCJhZGRfZW1wbG95ZWVcIixcbiAgICAgIGFwaTogcHJvcHMuYXBpLFxuICAgICAgZGF0YVNvdXJjZTogSW52ZW50b3J5RFMsXG4gICAgICBjb2RlOiBhcHBzeW5jLkNvZGUuZnJvbUFzc2V0KFwic3JjL211dGF0aW9ucy9jcmVhdGVFbXBsb3llZS5qc1wiKSxcbiAgICAgIHJ1bnRpbWU6IGFwcHN5bmMuRnVuY3Rpb25SdW50aW1lLkpTXzFfMF8wLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYWRkX2l0ZW0gPSBuZXcgYXBwc3luYy5BcHBzeW5jRnVuY3Rpb24odGhpcywgXCJmdW5jLWFkZC1pdGVtXCIsIHtcbiAgICAgIG5hbWU6IFwiYWRkX2l0ZW1cIixcbiAgICAgIGFwaTogcHJvcHMuYXBpLFxuICAgICAgZGF0YVNvdXJjZTogSW52ZW50b3J5RFMsXG4gICAgICBjb2RlOiBhcHBzeW5jLkNvZGUuZnJvbUFzc2V0KFwic3JjL211dGF0aW9ucy9jcmVhdGVJdGVtLmpzXCIpLFxuICAgICAgcnVudGltZTogYXBwc3luYy5GdW5jdGlvblJ1bnRpbWUuSlNfMV8wXzAsXG4gICAgfSk7XG5cbiAgICBjb25zdCBhZGRfaW52ZW50b3J5ID0gbmV3IGFwcHN5bmMuQXBwc3luY0Z1bmN0aW9uKFxuICAgICAgdGhpcyxcbiAgICAgIFwiZnVuYy1hZGQtaW52ZW50b3J5XCIsXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiYWRkX2ludmVudG9yeVwiLFxuICAgICAgICBhcGk6IHByb3BzLmFwaSxcbiAgICAgICAgZGF0YVNvdXJjZTogSW52ZW50b3J5RFMsXG4gICAgICAgIGNvZGU6IGFwcHN5bmMuQ29kZS5mcm9tQXNzZXQoXCJzcmMvbXV0YXRpb25zL2NyZWF0ZUludmVudG9yeS5qc1wiKSxcbiAgICAgICAgcnVudGltZTogYXBwc3luYy5GdW5jdGlvblJ1bnRpbWUuSlNfMV8wXzAsXG4gICAgICB9XG4gICAgKTtcblxuICAgIG5ldyBJbnZlbnRvcnlBcHBzeW5jUmVzb2x2ZXJTdGFjayh0aGlzLCBcIkludmVudG9yeVJlc29sdmVyXCIsIHtcbiAgICAgIGFwaTogcHJvcHMuYXBpLFxuICAgICAgY3JlYXRlX2ludmVudG9yeV9mdW5jOiBhZGRfaW52ZW50b3J5LFxuICAgICAgY3JlYXRlX2l0ZW1fZnVuYzogYWRkX2l0ZW0sXG4gICAgICBjcmVhdGVfdXNlcl9mdW5jOiBhZGRfZW1wLFxuICAgICAgcGFzc3Rocm91Z2g6IHBhc3N0aHJvdWdoLFxuICAgICAgZW52OiB7IGFjY291bnQ6IHRoaXMuYWNjb3VudCwgcmVnaW9uOiB0aGlzLnJlZ2lvbiB9LFxuICAgIH0pO1xuICB9XG59XG4iXX0=