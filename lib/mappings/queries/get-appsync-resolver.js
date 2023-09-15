"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAppsyncResolveStack = void 0;
const cdk = require("aws-cdk-lib");
const appsync = require("aws-cdk-lib/aws-appsync");
class GetAppsyncResolveStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        new appsync.Resolver(this, "pipeline-resolver-get-items", {
            api: props.api,
            typeName: "Query",
            fieldName: "items",
            runtime: appsync.FunctionRuntime.JS_1_0_0,
            pipelineConfig: [props.get_items_func],
            code: props.passthrough,
        });
        new appsync.Resolver(this, "getUserInventoriesRes", {
            api: props.api,
            typeName: "Query",
            fieldName: "getUserInventories",
            runtime: appsync.FunctionRuntime.JS_1_0_0,
            pipelineConfig: [props.get_user_inventories_func],
            code: props.passthrough,
        });
        new appsync.Resolver(this, "pipeline-resolver-get-users", {
            api: props.api,
            typeName: "Query",
            fieldName: "users",
            runtime: appsync.FunctionRuntime.JS_1_0_0,
            pipelineConfig: [props.get_users_func],
            code: props.passthrough,
        });
        new appsync.Resolver(this, "pipeline-resolver-get-inventories", {
            api: props.api,
            typeName: "Query",
            fieldName: "inventories",
            runtime: appsync.FunctionRuntime.JS_1_0_0,
            pipelineConfig: [props.get_inventories_func],
            code: props.passthrough,
        });
        new appsync.Resolver(this, "pipeline-resolver-get-inventory-items", {
            api: props.api,
            typeName: "Query",
            fieldName: "getInventoryItems",
            runtime: appsync.FunctionRuntime.JS_1_0_0,
            pipelineConfig: [props.get_inventory_items_func],
            code: props.passthrough,
        });
    }
}
exports.GetAppsyncResolveStack = GetAppsyncResolveStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWFwcHN5bmMtcmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnZXQtYXBwc3luYy1yZXNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBbUM7QUFFbkMsbURBQW1EO0FBV25ELE1BQWEsc0JBQXVCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDbkQsWUFDRSxLQUFnQixFQUNoQixFQUFVLEVBQ1YsS0FBa0M7UUFFbEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSw2QkFBNkIsRUFBRTtZQUN4RCxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7WUFDZCxRQUFRLEVBQUUsT0FBTztZQUNqQixTQUFTLEVBQUUsT0FBTztZQUNsQixPQUFPLEVBQUUsT0FBTyxDQUFDLGVBQWUsQ0FBQyxRQUFRO1lBQ3pDLGNBQWMsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUM7WUFDdEMsSUFBSSxFQUFFLEtBQUssQ0FBQyxXQUFXO1NBQ3hCLENBQUMsQ0FBQztRQUVILElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsdUJBQXVCLEVBQUU7WUFDbEQsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO1lBQ2QsUUFBUSxFQUFFLE9BQU87WUFDakIsU0FBUyxFQUFFLG9CQUFvQjtZQUMvQixPQUFPLEVBQUUsT0FBTyxDQUFDLGVBQWUsQ0FBQyxRQUFRO1lBQ3pDLGNBQWMsRUFBRSxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQztZQUNqRCxJQUFJLEVBQUUsS0FBSyxDQUFDLFdBQVc7U0FDeEIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSw2QkFBNkIsRUFBRTtZQUN4RCxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7WUFDZCxRQUFRLEVBQUUsT0FBTztZQUNqQixTQUFTLEVBQUUsT0FBTztZQUNsQixPQUFPLEVBQUUsT0FBTyxDQUFDLGVBQWUsQ0FBQyxRQUFRO1lBQ3pDLGNBQWMsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUM7WUFDdEMsSUFBSSxFQUFFLEtBQUssQ0FBQyxXQUFXO1NBQ3hCLENBQUMsQ0FBQztRQUVILElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsbUNBQW1DLEVBQUU7WUFDOUQsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO1lBQ2QsUUFBUSxFQUFFLE9BQU87WUFDakIsU0FBUyxFQUFFLGFBQWE7WUFDeEIsT0FBTyxFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsUUFBUTtZQUN6QyxjQUFjLEVBQUUsQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUM7WUFDNUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxXQUFXO1NBQ3hCLENBQUMsQ0FBQztRQUVILElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsdUNBQXVDLEVBQUU7WUFDbEUsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO1lBQ2QsUUFBUSxFQUFFLE9BQU87WUFDakIsU0FBUyxFQUFFLG1CQUFtQjtZQUM5QixPQUFPLEVBQUUsT0FBTyxDQUFDLGVBQWUsQ0FBQyxRQUFRO1lBQ3pDLGNBQWMsRUFBRSxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQztZQUNoRCxJQUFJLEVBQUUsS0FBSyxDQUFDLFdBQVc7U0FDeEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBckRELHdEQXFEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tIFwiYXdzLWNkay1saWJcIjtcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJjb25zdHJ1Y3RzXCI7XG5pbXBvcnQgKiBhcyBhcHBzeW5jIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtYXBwc3luY1wiO1xuXG5pbnRlcmZhY2UgR2V0QXBwc3luY1Jlc29sdmVTdGFja1Byb3BzIGV4dGVuZHMgY2RrLlN0YWNrUHJvcHMge1xuICBwYXNzdGhyb3VnaDogYXBwc3luYy5JbmxpbmVDb2RlO1xuICBnZXRfaW52ZW50b3J5X2l0ZW1zX2Z1bmM6IGFwcHN5bmMuQXBwc3luY0Z1bmN0aW9uO1xuICBnZXRfaXRlbXNfZnVuYzogYXBwc3luYy5BcHBzeW5jRnVuY3Rpb247XG4gIGdldF9pbnZlbnRvcmllc19mdW5jOiBhcHBzeW5jLkFwcHN5bmNGdW5jdGlvbjtcbiAgZ2V0X3VzZXJzX2Z1bmM6IGFwcHN5bmMuQXBwc3luY0Z1bmN0aW9uO1xuICBnZXRfdXNlcl9pbnZlbnRvcmllc19mdW5jOiBhcHBzeW5jLkFwcHN5bmNGdW5jdGlvbjtcbiAgYXBpOiBhcHBzeW5jLkdyYXBocWxBcGk7XG59XG5leHBvcnQgY2xhc3MgR2V0QXBwc3luY1Jlc29sdmVTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHNjb3BlOiBDb25zdHJ1Y3QsXG4gICAgaWQ6IHN0cmluZyxcbiAgICBwcm9wczogR2V0QXBwc3luY1Jlc29sdmVTdGFja1Byb3BzXG4gICkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgbmV3IGFwcHN5bmMuUmVzb2x2ZXIodGhpcywgXCJwaXBlbGluZS1yZXNvbHZlci1nZXQtaXRlbXNcIiwge1xuICAgICAgYXBpOiBwcm9wcy5hcGksXG4gICAgICB0eXBlTmFtZTogXCJRdWVyeVwiLFxuICAgICAgZmllbGROYW1lOiBcIml0ZW1zXCIsXG4gICAgICBydW50aW1lOiBhcHBzeW5jLkZ1bmN0aW9uUnVudGltZS5KU18xXzBfMCxcbiAgICAgIHBpcGVsaW5lQ29uZmlnOiBbcHJvcHMuZ2V0X2l0ZW1zX2Z1bmNdLFxuICAgICAgY29kZTogcHJvcHMucGFzc3Rocm91Z2gsXG4gICAgfSk7XG5cbiAgICBuZXcgYXBwc3luYy5SZXNvbHZlcih0aGlzLCBcImdldFVzZXJJbnZlbnRvcmllc1Jlc1wiLCB7XG4gICAgICBhcGk6IHByb3BzLmFwaSxcbiAgICAgIHR5cGVOYW1lOiBcIlF1ZXJ5XCIsXG4gICAgICBmaWVsZE5hbWU6IFwiZ2V0VXNlckludmVudG9yaWVzXCIsXG4gICAgICBydW50aW1lOiBhcHBzeW5jLkZ1bmN0aW9uUnVudGltZS5KU18xXzBfMCxcbiAgICAgIHBpcGVsaW5lQ29uZmlnOiBbcHJvcHMuZ2V0X3VzZXJfaW52ZW50b3JpZXNfZnVuY10sXG4gICAgICBjb2RlOiBwcm9wcy5wYXNzdGhyb3VnaCxcbiAgICB9KTtcblxuICAgIG5ldyBhcHBzeW5jLlJlc29sdmVyKHRoaXMsIFwicGlwZWxpbmUtcmVzb2x2ZXItZ2V0LXVzZXJzXCIsIHtcbiAgICAgIGFwaTogcHJvcHMuYXBpLFxuICAgICAgdHlwZU5hbWU6IFwiUXVlcnlcIixcbiAgICAgIGZpZWxkTmFtZTogXCJ1c2Vyc1wiLFxuICAgICAgcnVudGltZTogYXBwc3luYy5GdW5jdGlvblJ1bnRpbWUuSlNfMV8wXzAsXG4gICAgICBwaXBlbGluZUNvbmZpZzogW3Byb3BzLmdldF91c2Vyc19mdW5jXSxcbiAgICAgIGNvZGU6IHByb3BzLnBhc3N0aHJvdWdoLFxuICAgIH0pO1xuXG4gICAgbmV3IGFwcHN5bmMuUmVzb2x2ZXIodGhpcywgXCJwaXBlbGluZS1yZXNvbHZlci1nZXQtaW52ZW50b3JpZXNcIiwge1xuICAgICAgYXBpOiBwcm9wcy5hcGksXG4gICAgICB0eXBlTmFtZTogXCJRdWVyeVwiLFxuICAgICAgZmllbGROYW1lOiBcImludmVudG9yaWVzXCIsXG4gICAgICBydW50aW1lOiBhcHBzeW5jLkZ1bmN0aW9uUnVudGltZS5KU18xXzBfMCxcbiAgICAgIHBpcGVsaW5lQ29uZmlnOiBbcHJvcHMuZ2V0X2ludmVudG9yaWVzX2Z1bmNdLFxuICAgICAgY29kZTogcHJvcHMucGFzc3Rocm91Z2gsXG4gICAgfSk7XG5cbiAgICBuZXcgYXBwc3luYy5SZXNvbHZlcih0aGlzLCBcInBpcGVsaW5lLXJlc29sdmVyLWdldC1pbnZlbnRvcnktaXRlbXNcIiwge1xuICAgICAgYXBpOiBwcm9wcy5hcGksXG4gICAgICB0eXBlTmFtZTogXCJRdWVyeVwiLFxuICAgICAgZmllbGROYW1lOiBcImdldEludmVudG9yeUl0ZW1zXCIsXG4gICAgICBydW50aW1lOiBhcHBzeW5jLkZ1bmN0aW9uUnVudGltZS5KU18xXzBfMCxcbiAgICAgIHBpcGVsaW5lQ29uZmlnOiBbcHJvcHMuZ2V0X2ludmVudG9yeV9pdGVtc19mdW5jXSxcbiAgICAgIGNvZGU6IHByb3BzLnBhc3N0aHJvdWdoLFxuICAgIH0pO1xuICB9XG59XG4iXX0=