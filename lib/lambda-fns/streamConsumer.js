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
        event.Records[0].dynamodb?.NewImage?.SK.S?.slice(0, 6) === "ORDER#") {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyZWFtQ29uc3VtZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdHJlYW1Db25zdW1lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLDZDQUErQjtBQUMvQixvQ0FBbUQ7QUFFbkQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFbkIsS0FBSyxVQUFVLElBQUksQ0FDeEIsS0FBVSxFQUNWLE9BQWdCO0lBRWhCLGNBQU0sQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBRWxELHNDQUFzQztJQUN0QyxlQUFPLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztJQUVqQyxvRUFBb0U7SUFDcEUsY0FBTSxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDM0IsY0FBTSxDQUFDLHdCQUF3QixFQUFFLENBQUM7SUFFbEMseUNBQXlDO0lBQ3pDLGNBQU0sQ0FBQyxhQUFhLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUUzRCxzQ0FBc0M7SUFDdEMsZUFBTyxDQUFDLHNCQUFzQixFQUFFLENBQUM7SUFFakMsb0RBQW9EO0lBQ3BELGNBQU0sQ0FBQyxVQUFVLENBQUM7UUFDaEIsWUFBWSxFQUFFLE9BQU8sQ0FBQyxZQUFZO0tBQ25DLENBQUMsQ0FBQztJQUNILE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUM1QyxJQUNFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxLQUFLLFFBQVE7UUFDdkMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQ25FO1FBQ0EsTUFBTSxVQUFVLEdBQ2QsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDOUQscUVBQXFFO1FBQ3JFLGNBQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUM3QyxNQUFNLElBQUksR0FBRyxNQUFNLEdBQUc7YUFDbkIsV0FBVyxDQUFDO1lBQ1gsUUFBUSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBbUI7WUFDekMsV0FBVyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO1NBQ2hFLENBQUM7YUFDRCxPQUFPLEVBQUUsQ0FBQztRQUViLGNBQU0sQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ2pELE9BQU8sVUFBVSxDQUFDO0tBQ25CO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBM0NELG9CQTJDQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnkgKi9cbmltcG9ydCB7IER5bmFtb0RCU3RyZWFtRXZlbnQsIENvbnRleHQgfSBmcm9tIFwiYXdzLWxhbWJkYVwiO1xuaW1wb3J0ICogYXMgQVdTIGZyb20gXCJhd3Mtc2RrXCI7XG5pbXBvcnQgeyBsb2dnZXIsIG1ldHJpY3MsIHRyYWNlciB9IGZyb20gXCIuLi91dGlsc1wiO1xuXG5jb25zdCBzcXMgPSBuZXcgQVdTLlNRUygpO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFpbihcbiAgZXZlbnQ6IGFueSxcbiAgY29udGV4dDogQ29udGV4dFxuKTogUHJvbWlzZTxEeW5hbW9EQlN0cmVhbUV2ZW50PiB7XG4gIGxvZ2dlci5pbmZvKFwiTGFtYmRhIGludm9jYXRpb24gZXZlbnRcIiwgeyBldmVudCB9KTtcblxuICAvLyBNZXRyaWNzOiBDYXB0dXJlIGNvbGQgc3RhcnQgbWV0cmljc1xuICBtZXRyaWNzLmNhcHR1cmVDb2xkU3RhcnRNZXRyaWMoKTtcblxuICAvLyBUcmFjZXI6IEFubm90YXRlIHRoZSBzdWJzZWdtZW50IHdpdGggdGhlIGNvbGQgc3RhcnQgJiBzZXJ2aWNlTmFtZVxuICB0cmFjZXIuYW5ub3RhdGVDb2xkU3RhcnQoKTtcbiAgdHJhY2VyLmFkZFNlcnZpY2VOYW1lQW5ub3RhdGlvbigpO1xuXG4gIC8vIFRyYWNlcjogQWRkIGF3c1JlcXVlc3RJZCBhcyBhbm5vdGF0aW9uXG4gIHRyYWNlci5wdXRBbm5vdGF0aW9uKFwiYXdzUmVxdWVzdElkXCIsIGNvbnRleHQuYXdzUmVxdWVzdElkKTtcblxuICAvLyBNZXRyaWNzOiBDYXB0dXJlIGNvbGQgc3RhcnQgbWV0cmljc1xuICBtZXRyaWNzLmNhcHR1cmVDb2xkU3RhcnRNZXRyaWMoKTtcblxuICAvLyBMb2dnZXI6IEFwcGVuZCBhd3NSZXF1ZXN0SWQgdG8gZWFjaCBsb2cgc3RhdGVtZW50XG4gIGxvZ2dlci5hcHBlbmRLZXlzKHtcbiAgICBhd3NSZXF1ZXN0SWQ6IGNvbnRleHQuYXdzUmVxdWVzdElkLFxuICB9KTtcbiAgY29uc3QgZXZlbnRJbmRleCA9IGV2ZW50LlJlY29yZHMubGVuZ3RoIC0gMTtcbiAgaWYgKFxuICAgIGV2ZW50LlJlY29yZHNbMF0uZXZlbnROYW1lID09PSBcIk1PRElGWVwiICYmXG4gICAgZXZlbnQuUmVjb3Jkc1swXS5keW5hbW9kYj8uTmV3SW1hZ2U/LlNLLlM/LnNsaWNlKDAsIDYpID09PSBcIk9SREVSI1wiXG4gICkge1xuICAgIGNvbnN0IG9yZGVySXRlbXMgPVxuICAgICAgZXZlbnQuUmVjb3Jkc1tldmVudEluZGV4XS5keW5hbW9kYj8uTmV3SW1hZ2U/Lm9yZGVySXRlbXM/Lkw7XG4gICAgLy8gY29uc3QgdXNlcklkID0gZXZlbnQuUmVjb3Jkc1tldmVudEluZGV4XS5keW5hbW9kYj8uTmV3SW1hZ2U/LmlkLlM7XG4gICAgbG9nZ2VyLmluZm8oXCJPcmRlciBJdGVtczogXCIsIHsgb3JkZXJJdGVtcyB9KTtcbiAgICBjb25zdCB0ZXN0ID0gYXdhaXQgc3FzXG4gICAgICAuc2VuZE1lc3NhZ2Uoe1xuICAgICAgICBRdWV1ZVVybDogcHJvY2Vzcy5lbnYuUVVFVUVfVVJMIGFzIHN0cmluZyxcbiAgICAgICAgTWVzc2FnZUJvZHk6IEpTT04uc3RyaW5naWZ5KGV2ZW50LlJlY29yZHNbMF0uZHluYW1vZGIuTmV3SW1hZ2UpLFxuICAgICAgfSlcbiAgICAgIC5wcm9taXNlKCk7XG5cbiAgICBsb2dnZXIuaW5mbyhcIkxhbWJkYSBpbnZvY2F0aW9uIGV2ZW50XCIsIHsgdGVzdCB9KTtcbiAgICByZXR1cm4gb3JkZXJJdGVtcztcbiAgfVxuICByZXR1cm4gZXZlbnQ7XG59XG4iXX0=