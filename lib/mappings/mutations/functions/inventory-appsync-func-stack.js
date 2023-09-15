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
            env: { account: "132260253285", region: "eu-west-1" },
        });
    }
}
exports.InventoryAppsyncFuncStack = InventoryAppsyncFuncStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW52ZW50b3J5LWFwcHN5bmMtZnVuYy1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludmVudG9yeS1hcHBzeW5jLWZ1bmMtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBRW5DLG1EQUFtRDtBQUVuRCx3RkFBd0Y7QUFNeEYsTUFBYSx5QkFBMEIsU0FBUSxHQUFHLENBQUMsS0FBSztJQUN0RCxZQUNFLEtBQWdCLEVBQ2hCLEVBQVUsRUFDVixLQUFxQztRQUVyQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4QixNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUNqRCx1QkFBdUIsRUFDdkIsS0FBSyxDQUFDLGlCQUFpQixDQUN4QixDQUFDO1FBRUYsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUM7Ozs7Ozs7Ozs7O0tBV2pELENBQUMsQ0FBQztRQUNILE1BQU0sT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQ2pFLElBQUksRUFBRSxjQUFjO1lBQ3BCLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztZQUNkLFVBQVUsRUFBRSxXQUFXO1lBQ3ZCLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQ0FBaUMsQ0FBQztZQUMvRCxPQUFPLEVBQUUsT0FBTyxDQUFDLGVBQWUsQ0FBQyxRQUFRO1NBQzFDLENBQUMsQ0FBQztRQUVILE1BQU0sUUFBUSxHQUFHLElBQUksT0FBTyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQ2xFLElBQUksRUFBRSxVQUFVO1lBQ2hCLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztZQUNkLFVBQVUsRUFBRSxXQUFXO1lBQ3ZCLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyw2QkFBNkIsQ0FBQztZQUMzRCxPQUFPLEVBQUUsT0FBTyxDQUFDLGVBQWUsQ0FBQyxRQUFRO1NBQzFDLENBQUMsQ0FBQztRQUVILE1BQU0sYUFBYSxHQUFHLElBQUksT0FBTyxDQUFDLGVBQWUsQ0FDL0MsSUFBSSxFQUNKLG9CQUFvQixFQUNwQjtZQUNFLElBQUksRUFBRSxlQUFlO1lBQ3JCLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztZQUNkLFVBQVUsRUFBRSxXQUFXO1lBQ3ZCLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQ0FBa0MsQ0FBQztZQUNoRSxPQUFPLEVBQUUsT0FBTyxDQUFDLGVBQWUsQ0FBQyxRQUFRO1NBQzFDLENBQ0YsQ0FBQztRQUVGLElBQUksMERBQTZCLENBQUMsSUFBSSxFQUFFLG1CQUFtQixFQUFFO1lBQzNELEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztZQUNkLHFCQUFxQixFQUFFLGFBQWE7WUFDcEMsZ0JBQWdCLEVBQUUsUUFBUTtZQUMxQixnQkFBZ0IsRUFBRSxPQUFPO1lBQ3pCLFdBQVcsRUFBRSxXQUFXO1lBQ3hCLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRTtTQUN0RCxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUE3REQsOERBNkRDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gXCJhd3MtY2RrLWxpYlwiO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSBcImNvbnN0cnVjdHNcIjtcbmltcG9ydCAqIGFzIGFwcHN5bmMgZnJvbSBcImF3cy1jZGstbGliL2F3cy1hcHBzeW5jXCI7XG5pbXBvcnQgKiBhcyBkeW5hbW9kYiBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWR5bmFtb2RiXCI7XG5pbXBvcnQgeyBJbnZlbnRvcnlBcHBzeW5jUmVzb2x2ZXJTdGFjayB9IGZyb20gXCIuLi9yZXNvbHZlcnMvaW52ZW50b3J5LWFwcHN5bmMtcmVzb2x2ZXJcIjtcblxuaW50ZXJmYWNlIEludmVudG9yeUFwcHN5bmNGdW5jU3RhY2tQcm9wcyBleHRlbmRzIGNkay5TdGFja1Byb3BzIHtcbiAgaW52ZW50b3JpZXNfdGFibGU6IGR5bmFtb2RiLlRhYmxlO1xuICBhcGk6IGFwcHN5bmMuR3JhcGhxbEFwaTtcbn1cbmV4cG9ydCBjbGFzcyBJbnZlbnRvcnlBcHBzeW5jRnVuY1N0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3IoXG4gICAgc2NvcGU6IENvbnN0cnVjdCxcbiAgICBpZDogc3RyaW5nLFxuICAgIHByb3BzOiBJbnZlbnRvcnlBcHBzeW5jRnVuY1N0YWNrUHJvcHNcbiAgKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG4gICAgY29uc3QgSW52ZW50b3J5RFMgPSBwcm9wcy5hcGkuYWRkRHluYW1vRGJEYXRhU291cmNlKFxuICAgICAgXCJpbnZlbnRvcnlfZGF0YV9zb3VyY2VcIixcbiAgICAgIHByb3BzLmludmVudG9yaWVzX3RhYmxlXG4gICAgKTtcblxuICAgIGNvbnN0IHBhc3N0aHJvdWdoID0gYXBwc3luYy5JbmxpbmVDb2RlLmZyb21JbmxpbmUoYFxuICAgICAgICAvLyBUaGUgYmVmb3JlIHN0ZXBcbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIHJlcXVlc3QoLi4uYXJncykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGFyZ3MpO1xuICAgICAgICAgIHJldHVybiB7fVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIGFmdGVyIHN0ZXBcbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIHJlc3BvbnNlKGN0eCkge1xuICAgICAgICAgIHJldHVybiBjdHgucHJldi5yZXN1bHRcbiAgICAgICAgfVxuICAgIGApO1xuICAgIGNvbnN0IGFkZF9lbXAgPSBuZXcgYXBwc3luYy5BcHBzeW5jRnVuY3Rpb24odGhpcywgXCJmdW5jLWFkZC1wb3N0XCIsIHtcbiAgICAgIG5hbWU6IFwiYWRkX2VtcGxveWVlXCIsXG4gICAgICBhcGk6IHByb3BzLmFwaSxcbiAgICAgIGRhdGFTb3VyY2U6IEludmVudG9yeURTLFxuICAgICAgY29kZTogYXBwc3luYy5Db2RlLmZyb21Bc3NldChcInNyYy9tdXRhdGlvbnMvY3JlYXRlRW1wbG95ZWUuanNcIiksXG4gICAgICBydW50aW1lOiBhcHBzeW5jLkZ1bmN0aW9uUnVudGltZS5KU18xXzBfMCxcbiAgICB9KTtcblxuICAgIGNvbnN0IGFkZF9pdGVtID0gbmV3IGFwcHN5bmMuQXBwc3luY0Z1bmN0aW9uKHRoaXMsIFwiZnVuYy1hZGQtaXRlbVwiLCB7XG4gICAgICBuYW1lOiBcImFkZF9pdGVtXCIsXG4gICAgICBhcGk6IHByb3BzLmFwaSxcbiAgICAgIGRhdGFTb3VyY2U6IEludmVudG9yeURTLFxuICAgICAgY29kZTogYXBwc3luYy5Db2RlLmZyb21Bc3NldChcInNyYy9tdXRhdGlvbnMvY3JlYXRlSXRlbS5qc1wiKSxcbiAgICAgIHJ1bnRpbWU6IGFwcHN5bmMuRnVuY3Rpb25SdW50aW1lLkpTXzFfMF8wLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYWRkX2ludmVudG9yeSA9IG5ldyBhcHBzeW5jLkFwcHN5bmNGdW5jdGlvbihcbiAgICAgIHRoaXMsXG4gICAgICBcImZ1bmMtYWRkLWludmVudG9yeVwiLFxuICAgICAge1xuICAgICAgICBuYW1lOiBcImFkZF9pbnZlbnRvcnlcIixcbiAgICAgICAgYXBpOiBwcm9wcy5hcGksXG4gICAgICAgIGRhdGFTb3VyY2U6IEludmVudG9yeURTLFxuICAgICAgICBjb2RlOiBhcHBzeW5jLkNvZGUuZnJvbUFzc2V0KFwic3JjL211dGF0aW9ucy9jcmVhdGVJbnZlbnRvcnkuanNcIiksXG4gICAgICAgIHJ1bnRpbWU6IGFwcHN5bmMuRnVuY3Rpb25SdW50aW1lLkpTXzFfMF8wLFxuICAgICAgfVxuICAgICk7XG5cbiAgICBuZXcgSW52ZW50b3J5QXBwc3luY1Jlc29sdmVyU3RhY2sodGhpcywgXCJJbnZlbnRvcnlSZXNvbHZlclwiLCB7XG4gICAgICBhcGk6IHByb3BzLmFwaSxcbiAgICAgIGNyZWF0ZV9pbnZlbnRvcnlfZnVuYzogYWRkX2ludmVudG9yeSxcbiAgICAgIGNyZWF0ZV9pdGVtX2Z1bmM6IGFkZF9pdGVtLFxuICAgICAgY3JlYXRlX3VzZXJfZnVuYzogYWRkX2VtcCxcbiAgICAgIHBhc3N0aHJvdWdoOiBwYXNzdGhyb3VnaCxcbiAgICAgIGVudjogeyBhY2NvdW50OiBcIjEzMjI2MDI1MzI4NVwiLCByZWdpb246IFwiZXUtd2VzdC0xXCIgfSxcbiAgICB9KTtcbiAgfVxufVxuIl19