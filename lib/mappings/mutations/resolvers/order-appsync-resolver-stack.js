"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderAppSyncResolverStack = void 0;
const cdk = require("aws-cdk-lib");
const appsync = require("aws-cdk-lib/aws-appsync");
class OrderAppSyncResolverStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        new appsync.Resolver(this, "pipeline-resolver-add-item-to-cart", {
            api: props.api,
            typeName: "Mutation",
            fieldName: "addItemToCart",
            code: props.passthrough,
            runtime: appsync.FunctionRuntime.JS_1_0_0,
            pipelineConfig: [props.add_item_to_cart_func],
        });
        new appsync.Resolver(this, "pipeline-resolver-place_order", {
            api: props.api,
            typeName: "Mutation",
            fieldName: "placeOrder",
            code: props.passthrough,
            runtime: appsync.FunctionRuntime.JS_1_0_0,
            pipelineConfig: [props.place_order_func],
        });
    }
}
exports.OrderAppSyncResolverStack = OrderAppSyncResolverStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXItYXBwc3luYy1yZXNvbHZlci1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm9yZGVyLWFwcHN5bmMtcmVzb2x2ZXItc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBRW5DLG1EQUFtRDtBQVFuRCxNQUFhLHlCQUEwQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ3RELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBZ0M7UUFDeEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxvQ0FBb0MsRUFBRTtZQUMvRCxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7WUFDZCxRQUFRLEVBQUUsVUFBVTtZQUNwQixTQUFTLEVBQUUsZUFBZTtZQUMxQixJQUFJLEVBQUUsS0FBSyxDQUFDLFdBQVc7WUFDdkIsT0FBTyxFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsUUFBUTtZQUN6QyxjQUFjLEVBQUUsQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUM7U0FDOUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSwrQkFBK0IsRUFBRTtZQUMxRCxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7WUFDZCxRQUFRLEVBQUUsVUFBVTtZQUNwQixTQUFTLEVBQUUsWUFBWTtZQUN2QixJQUFJLEVBQUUsS0FBSyxDQUFDLFdBQVc7WUFDdkIsT0FBTyxFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsUUFBUTtZQUN6QyxjQUFjLEVBQUUsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUM7U0FDekMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBdEJELDhEQXNCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tIFwiYXdzLWNkay1saWJcIjtcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJjb25zdHJ1Y3RzXCI7XG5pbXBvcnQgKiBhcyBhcHBzeW5jIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtYXBwc3luY1wiO1xuXG5pbnRlcmZhY2UgQXBwU3luY1Jlc29sdmVyU3RhY2tQcm9wcyBleHRlbmRzIGNkay5TdGFja1Byb3BzIHtcbiAgcGFzc3Rocm91Z2g6IGFwcHN5bmMuSW5saW5lQ29kZTtcbiAgYWRkX2l0ZW1fdG9fY2FydF9mdW5jOiBhcHBzeW5jLkFwcHN5bmNGdW5jdGlvbjtcbiAgcGxhY2Vfb3JkZXJfZnVuYzogYXBwc3luYy5BcHBzeW5jRnVuY3Rpb247XG4gIGFwaTogYXBwc3luYy5HcmFwaHFsQXBpO1xufVxuZXhwb3J0IGNsYXNzIE9yZGVyQXBwU3luY1Jlc29sdmVyU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQXBwU3luY1Jlc29sdmVyU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgbmV3IGFwcHN5bmMuUmVzb2x2ZXIodGhpcywgXCJwaXBlbGluZS1yZXNvbHZlci1hZGQtaXRlbS10by1jYXJ0XCIsIHtcbiAgICAgIGFwaTogcHJvcHMuYXBpLFxuICAgICAgdHlwZU5hbWU6IFwiTXV0YXRpb25cIixcbiAgICAgIGZpZWxkTmFtZTogXCJhZGRJdGVtVG9DYXJ0XCIsXG4gICAgICBjb2RlOiBwcm9wcy5wYXNzdGhyb3VnaCxcbiAgICAgIHJ1bnRpbWU6IGFwcHN5bmMuRnVuY3Rpb25SdW50aW1lLkpTXzFfMF8wLFxuICAgICAgcGlwZWxpbmVDb25maWc6IFtwcm9wcy5hZGRfaXRlbV90b19jYXJ0X2Z1bmNdLFxuICAgIH0pO1xuXG4gICAgbmV3IGFwcHN5bmMuUmVzb2x2ZXIodGhpcywgXCJwaXBlbGluZS1yZXNvbHZlci1wbGFjZV9vcmRlclwiLCB7XG4gICAgICBhcGk6IHByb3BzLmFwaSxcbiAgICAgIHR5cGVOYW1lOiBcIk11dGF0aW9uXCIsXG4gICAgICBmaWVsZE5hbWU6IFwicGxhY2VPcmRlclwiLFxuICAgICAgY29kZTogcHJvcHMucGFzc3Rocm91Z2gsXG4gICAgICBydW50aW1lOiBhcHBzeW5jLkZ1bmN0aW9uUnVudGltZS5KU18xXzBfMCxcbiAgICAgIHBpcGVsaW5lQ29uZmlnOiBbcHJvcHMucGxhY2Vfb3JkZXJfZnVuY10sXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==