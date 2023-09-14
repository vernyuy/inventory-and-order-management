"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryAppsyncResolverStack = void 0;
const cdk = require("aws-cdk-lib");
const appsync = require("aws-cdk-lib/aws-appsync");
class InventoryAppsyncResolverStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        new appsync.Resolver(this, "pipeline-resolver-create-item", {
            api: props.api,
            typeName: "Mutation",
            fieldName: "createItem",
            code: props.passthrough,
            runtime: appsync.FunctionRuntime.JS_1_0_0,
            pipelineConfig: [props.create_item_func],
        });
        new appsync.Resolver(this, "pipeline-resolver-create-inventory", {
            api: props.api,
            typeName: "Mutation",
            fieldName: "createInventory",
            code: props.passthrough,
            runtime: appsync.FunctionRuntime.JS_1_0_0,
            pipelineConfig: [props.create_inventory_func],
        });
        new appsync.Resolver(this, "pipeline-resolver-create-posts", {
            api: props.api,
            typeName: "Mutation",
            fieldName: "createUser",
            code: props.passthrough,
            runtime: appsync.FunctionRuntime.JS_1_0_0,
            pipelineConfig: [props.create_user_func],
        });
    }
}
exports.InventoryAppsyncResolverStack = InventoryAppsyncResolverStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW52ZW50b3J5LWFwcHN5bmMtcmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnZlbnRvcnktYXBwc3luYy1yZXNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBbUM7QUFFbkMsbURBQW1EO0FBU25ELE1BQWEsNkJBQThCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDMUQsWUFDRSxLQUFnQixFQUNoQixFQUFVLEVBQ1YsS0FBeUM7UUFFekMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSwrQkFBK0IsRUFBRTtZQUMxRCxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7WUFDZCxRQUFRLEVBQUUsVUFBVTtZQUNwQixTQUFTLEVBQUUsWUFBWTtZQUN2QixJQUFJLEVBQUUsS0FBSyxDQUFDLFdBQVc7WUFDdkIsT0FBTyxFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsUUFBUTtZQUN6QyxjQUFjLEVBQUUsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUM7U0FDekMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxvQ0FBb0MsRUFBRTtZQUMvRCxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7WUFDZCxRQUFRLEVBQUUsVUFBVTtZQUNwQixTQUFTLEVBQUUsaUJBQWlCO1lBQzVCLElBQUksRUFBRSxLQUFLLENBQUMsV0FBVztZQUN2QixPQUFPLEVBQUUsT0FBTyxDQUFDLGVBQWUsQ0FBQyxRQUFRO1lBQ3pDLGNBQWMsRUFBRSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQztTQUM5QyxDQUFDLENBQUM7UUFFSCxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGdDQUFnQyxFQUFFO1lBQzNELEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztZQUNkLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFNBQVMsRUFBRSxZQUFZO1lBQ3ZCLElBQUksRUFBRSxLQUFLLENBQUMsV0FBVztZQUN2QixPQUFPLEVBQUUsT0FBTyxDQUFDLGVBQWUsQ0FBQyxRQUFRO1lBQ3pDLGNBQWMsRUFBRSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQztTQUN6QyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFuQ0Qsc0VBbUNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gXCJhd3MtY2RrLWxpYlwiO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSBcImNvbnN0cnVjdHNcIjtcbmltcG9ydCAqIGFzIGFwcHN5bmMgZnJvbSBcImF3cy1jZGstbGliL2F3cy1hcHBzeW5jXCI7XG5cbmludGVyZmFjZSBJbnZlbnRvcnlBcHBzeW5jUmVzb2x2ZXJTdGFja1Byb3BzIGV4dGVuZHMgY2RrLlN0YWNrUHJvcHMge1xuICBwYXNzdGhyb3VnaDogYXBwc3luYy5JbmxpbmVDb2RlO1xuICBjcmVhdGVfaXRlbV9mdW5jOiBhcHBzeW5jLkFwcHN5bmNGdW5jdGlvbjtcbiAgY3JlYXRlX2ludmVudG9yeV9mdW5jOiBhcHBzeW5jLkFwcHN5bmNGdW5jdGlvbjtcbiAgY3JlYXRlX3VzZXJfZnVuYzogYXBwc3luYy5BcHBzeW5jRnVuY3Rpb247XG4gIGFwaTogYXBwc3luYy5HcmFwaHFsQXBpO1xufVxuZXhwb3J0IGNsYXNzIEludmVudG9yeUFwcHN5bmNSZXNvbHZlclN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3IoXG4gICAgc2NvcGU6IENvbnN0cnVjdCxcbiAgICBpZDogc3RyaW5nLFxuICAgIHByb3BzOiBJbnZlbnRvcnlBcHBzeW5jUmVzb2x2ZXJTdGFja1Byb3BzXG4gICkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgbmV3IGFwcHN5bmMuUmVzb2x2ZXIodGhpcywgXCJwaXBlbGluZS1yZXNvbHZlci1jcmVhdGUtaXRlbVwiLCB7XG4gICAgICBhcGk6IHByb3BzLmFwaSxcbiAgICAgIHR5cGVOYW1lOiBcIk11dGF0aW9uXCIsXG4gICAgICBmaWVsZE5hbWU6IFwiY3JlYXRlSXRlbVwiLFxuICAgICAgY29kZTogcHJvcHMucGFzc3Rocm91Z2gsXG4gICAgICBydW50aW1lOiBhcHBzeW5jLkZ1bmN0aW9uUnVudGltZS5KU18xXzBfMCxcbiAgICAgIHBpcGVsaW5lQ29uZmlnOiBbcHJvcHMuY3JlYXRlX2l0ZW1fZnVuY10sXG4gICAgfSk7XG5cbiAgICBuZXcgYXBwc3luYy5SZXNvbHZlcih0aGlzLCBcInBpcGVsaW5lLXJlc29sdmVyLWNyZWF0ZS1pbnZlbnRvcnlcIiwge1xuICAgICAgYXBpOiBwcm9wcy5hcGksXG4gICAgICB0eXBlTmFtZTogXCJNdXRhdGlvblwiLFxuICAgICAgZmllbGROYW1lOiBcImNyZWF0ZUludmVudG9yeVwiLFxuICAgICAgY29kZTogcHJvcHMucGFzc3Rocm91Z2gsXG4gICAgICBydW50aW1lOiBhcHBzeW5jLkZ1bmN0aW9uUnVudGltZS5KU18xXzBfMCxcbiAgICAgIHBpcGVsaW5lQ29uZmlnOiBbcHJvcHMuY3JlYXRlX2ludmVudG9yeV9mdW5jXSxcbiAgICB9KTtcblxuICAgIG5ldyBhcHBzeW5jLlJlc29sdmVyKHRoaXMsIFwicGlwZWxpbmUtcmVzb2x2ZXItY3JlYXRlLXBvc3RzXCIsIHtcbiAgICAgIGFwaTogcHJvcHMuYXBpLFxuICAgICAgdHlwZU5hbWU6IFwiTXV0YXRpb25cIixcbiAgICAgIGZpZWxkTmFtZTogXCJjcmVhdGVVc2VyXCIsXG4gICAgICBjb2RlOiBwcm9wcy5wYXNzdGhyb3VnaCxcbiAgICAgIHJ1bnRpbWU6IGFwcHN5bmMuRnVuY3Rpb25SdW50aW1lLkpTXzFfMF8wLFxuICAgICAgcGlwZWxpbmVDb25maWc6IFtwcm9wcy5jcmVhdGVfdXNlcl9mdW5jXSxcbiAgICB9KTtcbiAgfVxufVxuIl19