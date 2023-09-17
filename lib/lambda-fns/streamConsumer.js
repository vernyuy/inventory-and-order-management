"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const AWS = __importStar(require("aws-sdk"));
const utils_1 = require("../utils");
const sqs = new AWS.SQS();
async function main(event, context) {
    utils_1.logger.info("Lambda invocation event", { event });
    // Metrics: Capture cold start metrics
    utils_1.metrics.captureColdStartMetric();
    // Tracer: Get facade segment created by AWS Lambda
    const segment = utils_1.tracer.getSegment();
    // Tracer: Create subsegment for the function & set it as active
    let handlerSegment;
    if (segment) {
        handlerSegment = segment.addNewSubsegment(`## ${process.env._HANDLER}`);
        utils_1.tracer.setSegment(handlerSegment);
    }
    // Tracer: Annotate the subsegment with the cold start & serviceName
    utils_1.tracer.annotateColdStart();
    utils_1.tracer.addServiceNameAnnotation();
    // Tracer: Add awsRequestId as annotation
    utils_1.tracer.putAnnotation("awsRequestId", context.awsRequestId);
    // Metrics: Capture cold start metrics
    utils_1.metrics.captureColdStartMetric();
    // Logger: Append awsRequestId to each log statement
    utils_1.logger.appendKeys({
        awsRequestId: context.awsRequestId,
    });
    const eventIndex = event.Records.length - 1;
    if (event.Records[0].eventName === "MODIFY" &&
        event.Records[0].dynamodb?.NewImage?.sk.S?.slice(0, 6) === "ORDER#") {
        const orderItems = event.Records[eventIndex].dynamodb?.NewImage?.orderItems?.L;
        // const userId = event.Records[eventIndex].dynamodb?.NewImage?.id.S;
        utils_1.logger.info("Order Items: ", { orderItems });
        const test = await sqs
            .sendMessage({
            QueueUrl: process.env.QUEUE_URL,
            MessageBody: JSON.stringify(event.Records[0].dynamodb.NewImage),
        })
            .promise();
        utils_1.logger.info("Lambda invocation event", { test });
        return orderItems;
    }
    return event;
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyZWFtQ29uc3VtZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdHJlYW1Db25zdW1lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLDZDQUErQjtBQUMvQixvQ0FBbUQ7QUFJbkQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFbkIsS0FBSyxVQUFVLElBQUksQ0FDeEIsS0FBVSxFQUNWLE9BQWdCO0lBRWhCLGNBQU0sQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBRWxELHNDQUFzQztJQUN0QyxlQUFPLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztJQUVqQyxtREFBbUQ7SUFDbkQsTUFBTSxPQUFPLEdBQUcsY0FBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBRXBDLGdFQUFnRTtJQUNoRSxJQUFJLGNBQXNDLENBQUM7SUFDM0MsSUFBSSxPQUFPLEVBQUU7UUFDWCxjQUFjLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ3hFLGNBQU0sQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUM7S0FDbkM7SUFDRCxvRUFBb0U7SUFDcEUsY0FBTSxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDM0IsY0FBTSxDQUFDLHdCQUF3QixFQUFFLENBQUM7SUFFbEMseUNBQXlDO0lBQ3pDLGNBQU0sQ0FBQyxhQUFhLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUUzRCxzQ0FBc0M7SUFDdEMsZUFBTyxDQUFDLHNCQUFzQixFQUFFLENBQUM7SUFFakMsb0RBQW9EO0lBQ3BELGNBQU0sQ0FBQyxVQUFVLENBQUM7UUFDaEIsWUFBWSxFQUFFLE9BQU8sQ0FBQyxZQUFZO0tBQ25DLENBQUMsQ0FBQztJQUNILE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUM1QyxJQUNFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxLQUFLLFFBQVE7UUFDdkMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQ25FO1FBQ0EsTUFBTSxVQUFVLEdBQ2QsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDOUQscUVBQXFFO1FBQ3JFLGNBQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUM3QyxNQUFNLElBQUksR0FBRyxNQUFNLEdBQUc7YUFDbkIsV0FBVyxDQUFDO1lBQ1gsUUFBUSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBbUI7WUFDekMsV0FBVyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO1NBQ2hFLENBQUM7YUFDRCxPQUFPLEVBQUUsQ0FBQztRQUViLGNBQU0sQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ2pELE9BQU8sVUFBVSxDQUFDO0tBQ25CO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBcERELG9CQW9EQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IER5bmFtb0RCU3RyZWFtRXZlbnQsIENvbnRleHQgfSBmcm9tIFwiYXdzLWxhbWJkYVwiO1xuaW1wb3J0ICogYXMgQVdTIGZyb20gXCJhd3Mtc2RrXCI7XG5pbXBvcnQgeyBsb2dnZXIsIG1ldHJpY3MsIHRyYWNlciB9IGZyb20gXCIuLi91dGlsc1wiO1xuLy8gaW1wb3J0IHsgdjQgYXMgdXVpZHY0IH0gZnJvbSBcInV1aWRcIjtcbmltcG9ydCB0eXBlIHsgU3Vic2VnbWVudCB9IGZyb20gXCJhd3MteHJheS1zZGstY29yZVwiO1xuXG5jb25zdCBzcXMgPSBuZXcgQVdTLlNRUygpO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFpbihcbiAgZXZlbnQ6IGFueSxcbiAgY29udGV4dDogQ29udGV4dFxuKTogUHJvbWlzZTxEeW5hbW9EQlN0cmVhbUV2ZW50PiB7XG4gIGxvZ2dlci5pbmZvKFwiTGFtYmRhIGludm9jYXRpb24gZXZlbnRcIiwgeyBldmVudCB9KTtcblxuICAvLyBNZXRyaWNzOiBDYXB0dXJlIGNvbGQgc3RhcnQgbWV0cmljc1xuICBtZXRyaWNzLmNhcHR1cmVDb2xkU3RhcnRNZXRyaWMoKTtcblxuICAvLyBUcmFjZXI6IEdldCBmYWNhZGUgc2VnbWVudCBjcmVhdGVkIGJ5IEFXUyBMYW1iZGFcbiAgY29uc3Qgc2VnbWVudCA9IHRyYWNlci5nZXRTZWdtZW50KCk7XG5cbiAgLy8gVHJhY2VyOiBDcmVhdGUgc3Vic2VnbWVudCBmb3IgdGhlIGZ1bmN0aW9uICYgc2V0IGl0IGFzIGFjdGl2ZVxuICBsZXQgaGFuZGxlclNlZ21lbnQ6IFN1YnNlZ21lbnQgfCB1bmRlZmluZWQ7XG4gIGlmIChzZWdtZW50KSB7XG4gICAgaGFuZGxlclNlZ21lbnQgPSBzZWdtZW50LmFkZE5ld1N1YnNlZ21lbnQoYCMjICR7cHJvY2Vzcy5lbnYuX0hBTkRMRVJ9YCk7XG4gICAgdHJhY2VyLnNldFNlZ21lbnQoaGFuZGxlclNlZ21lbnQpO1xuICB9XG4gIC8vIFRyYWNlcjogQW5ub3RhdGUgdGhlIHN1YnNlZ21lbnQgd2l0aCB0aGUgY29sZCBzdGFydCAmIHNlcnZpY2VOYW1lXG4gIHRyYWNlci5hbm5vdGF0ZUNvbGRTdGFydCgpO1xuICB0cmFjZXIuYWRkU2VydmljZU5hbWVBbm5vdGF0aW9uKCk7XG5cbiAgLy8gVHJhY2VyOiBBZGQgYXdzUmVxdWVzdElkIGFzIGFubm90YXRpb25cbiAgdHJhY2VyLnB1dEFubm90YXRpb24oXCJhd3NSZXF1ZXN0SWRcIiwgY29udGV4dC5hd3NSZXF1ZXN0SWQpO1xuXG4gIC8vIE1ldHJpY3M6IENhcHR1cmUgY29sZCBzdGFydCBtZXRyaWNzXG4gIG1ldHJpY3MuY2FwdHVyZUNvbGRTdGFydE1ldHJpYygpO1xuXG4gIC8vIExvZ2dlcjogQXBwZW5kIGF3c1JlcXVlc3RJZCB0byBlYWNoIGxvZyBzdGF0ZW1lbnRcbiAgbG9nZ2VyLmFwcGVuZEtleXMoe1xuICAgIGF3c1JlcXVlc3RJZDogY29udGV4dC5hd3NSZXF1ZXN0SWQsXG4gIH0pO1xuICBjb25zdCBldmVudEluZGV4ID0gZXZlbnQuUmVjb3Jkcy5sZW5ndGggLSAxO1xuICBpZiAoXG4gICAgZXZlbnQuUmVjb3Jkc1swXS5ldmVudE5hbWUgPT09IFwiTU9ESUZZXCIgJiZcbiAgICBldmVudC5SZWNvcmRzWzBdLmR5bmFtb2RiPy5OZXdJbWFnZT8uc2suUz8uc2xpY2UoMCwgNikgPT09IFwiT1JERVIjXCJcbiAgKSB7XG4gICAgY29uc3Qgb3JkZXJJdGVtcyA9XG4gICAgICBldmVudC5SZWNvcmRzW2V2ZW50SW5kZXhdLmR5bmFtb2RiPy5OZXdJbWFnZT8ub3JkZXJJdGVtcz8uTDtcbiAgICAvLyBjb25zdCB1c2VySWQgPSBldmVudC5SZWNvcmRzW2V2ZW50SW5kZXhdLmR5bmFtb2RiPy5OZXdJbWFnZT8uaWQuUztcbiAgICBsb2dnZXIuaW5mbyhcIk9yZGVyIEl0ZW1zOiBcIiwgeyBvcmRlckl0ZW1zIH0pO1xuICAgIGNvbnN0IHRlc3QgPSBhd2FpdCBzcXNcbiAgICAgIC5zZW5kTWVzc2FnZSh7XG4gICAgICAgIFF1ZXVlVXJsOiBwcm9jZXNzLmVudi5RVUVVRV9VUkwgYXMgc3RyaW5nLFxuICAgICAgICBNZXNzYWdlQm9keTogSlNPTi5zdHJpbmdpZnkoZXZlbnQuUmVjb3Jkc1swXS5keW5hbW9kYi5OZXdJbWFnZSksXG4gICAgICB9KVxuICAgICAgLnByb21pc2UoKTtcblxuICAgIGxvZ2dlci5pbmZvKFwiTGFtYmRhIGludm9jYXRpb24gZXZlbnRcIiwgeyB0ZXN0IH0pO1xuICAgIHJldHVybiBvcmRlckl0ZW1zO1xuICB9XG4gIHJldHVybiBldmVudDtcbn1cbiJdfQ==