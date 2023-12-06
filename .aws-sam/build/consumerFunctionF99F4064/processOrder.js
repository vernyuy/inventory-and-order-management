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
const logger_1 = require("@aws-lambda-powertools/logger");
const metrics_1 = require("@aws-lambda-powertools/metrics");
const tracer_1 = require("@aws-lambda-powertools/tracer");
const version_1 = require("@aws-lambda-powertools/commons/lib/version");
// import type { Subsegment } from "aws-xray-sdk-core";
const sqs = new AWS.SQS();
const defaultValues = {
    region: process.env.AWS_REGION || "N/A",
    executionEnv: process.env.AWS_EXECUTION_ENV || "N/A",
};
const logger = new logger_1.Logger({
    persistentLogAttributes: {
        ...defaultValues,
        logger: {
            name: "@aws-lambda-powertools/logger",
            version: version_1.PT_VERSION,
        },
    },
});
const metrics = new metrics_1.Metrics({
    defaultDimensions: defaultValues,
});
const tracer = new tracer_1.Tracer();
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;
async function main(event, context) {
    // Logger: Log the incoming event
    logger.info("Lambda invocation event", { event });
    tracer.annotateColdStart();
    tracer.addServiceNameAnnotation();
    // Tracer: Add awsRequestId as annotation
    tracer.putAnnotation("awsRequestId", context.awsRequestId);
    // Metrics: Capture cold start metrics
    metrics.captureColdStartMetric();
    // Logger: Append awsRequestId to each log statement
    logger.appendKeys({
        awsRequestId: context.awsRequestId,
    });
    if (event.Records[0].eventName === "INSERT" &&
        event.Records[0].dynamodb?.NewImage?.SK.S?.slice(0, 6) === "ORDER#") {
        logger.info(`Response ${event.Records[0].eventName}`, {
            statusCode: 200,
            body: event.Records,
        });
        const id = event.Records[0].dynamodb?.NewImage?.PK.S;
        const orderId = event.Records[0].dynamodb?.NewImage?.SK.S;
        const cartItems = await docClient
            .query({
            TableName: tableName,
            KeyConditionExpression: "PK = :id AND begins_with(PK, :sk)",
            FilterExpression: "cartProductStatus = :status",
            ProjectionExpression: "sk, quantity, unit_price",
            ExpressionAttributeValues: {
                ":id": id,
                ":sk": "ITEM#",
                ":status": "PENDING",
            },
        })
            .promise();
        logger.info(`Cart Items`, {
            statusCode: 200,
            body: cartItems,
        });
        let total_price = 0;
        cartItems.Items?.forEach((item) => {
            total_price += parseFloat(item.unit_price) * parseInt(item.quantity);
        });
        try {
            const result = await docClient
                .update({
                TableName: tableName,
                Key: {
                    PK: id,
                    SK: orderId,
                },
                UpdateExpression: "set orderItems = :orderItems, orderStatus = :status, total_items = :total_items, total_price = :total_price, UpdatedOn = :update",
                ExpressionAttributeValues: {
                    ":orderItems": cartItems.Items,
                    ":status": "ORDERED",
                    ":total_items": cartItems.Items?.length,
                    ":total_price": total_price,
                    ":update": Date.now().toString(),
                },
            })
                .promise();
            logger.info(`Process Order Result`, {
                statusCode: 200,
                body: result,
            });
        }
        catch (err) {
            tracer.addErrorAsMetadata(err);
            logger.info(`Error`, {
                statusCode: 500,
                error: err,
            });
        }
    }
    const eventIndex = event.Records.length - 1;
    if (event.Records[0].eventName === "MODIFY" &&
        event.Records[0].dynamodb?.NewImage?.SK.S?.slice(0, 6) === "ORDER#") {
        const orderItems = event.Records[eventIndex].dynamodb?.NewImage?.orderItems?.L;
        // const userId = event.Records[eventIndex].dynamodb?.NewImage?.id.S;
        logger.info("Order Items: ", { orderItems });
        const test = await sqs
            .sendMessage({
            QueueUrl: process.env.QUEUE_URL,
            MessageBody: JSON.stringify(event.Records[0].dynamodb.NewImage),
        })
            .promise();
        logger.info("Lambda invocation event", { test });
        return event;
    }
    return event;
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY2Vzc09yZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicHJvY2Vzc09yZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsNkNBQStCO0FBQy9CLDBEQUF1RDtBQUN2RCw0REFBeUQ7QUFDekQsMERBQXVEO0FBQ3ZELHdFQUF3RTtBQUN4RSx1REFBdUQ7QUFDdkQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsTUFBTSxhQUFhLEdBQUc7SUFDcEIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLEtBQUs7SUFDdkMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLElBQUksS0FBSztDQUNyRCxDQUFDO0FBRUYsTUFBTSxNQUFNLEdBQUcsSUFBSSxlQUFNLENBQUM7SUFDeEIsdUJBQXVCLEVBQUU7UUFDdkIsR0FBRyxhQUFhO1FBQ2hCLE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSwrQkFBK0I7WUFDckMsT0FBTyxFQUFFLG9CQUFVO1NBQ3BCO0tBQ0Y7Q0FDRixDQUFDLENBQUM7QUFFSCxNQUFNLE9BQU8sR0FBRyxJQUFJLGlCQUFPLENBQUM7SUFDMUIsaUJBQWlCLEVBQUUsYUFBYTtDQUNqQyxDQUFDLENBQUM7QUFFSCxNQUFNLE1BQU0sR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDO0FBRTVCLE1BQU0sU0FBUyxHQUFHLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNwRCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQW9CLENBQUM7QUFFNUMsS0FBSyxVQUFVLElBQUksQ0FDeEIsS0FBMEIsRUFDMUIsT0FBZ0I7SUFFaEIsaUNBQWlDO0lBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFD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QUFPLEtBQUssQ0FBQztLQUNkO0lBRUQsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBOUdELG9CQThHQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IER5bmFtb0RCU3RyZWFtRXZlbnQsIENvbnRleHQgfSBmcm9tIFwiYXdzLWxhbWJkYVwiO1xuaW1wb3J0ICogYXMgQVdTIGZyb20gXCJhd3Mtc2RrXCI7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tIFwiQGF3cy1sYW1iZGEtcG93ZXJ0b29scy9sb2dnZXJcIjtcbmltcG9ydCB7IE1ldHJpY3MgfSBmcm9tIFwiQGF3cy1sYW1iZGEtcG93ZXJ0b29scy9tZXRyaWNzXCI7XG5pbXBvcnQgeyBUcmFjZXIgfSBmcm9tIFwiQGF3cy1sYW1iZGEtcG93ZXJ0b29scy90cmFjZXJcIjtcbmltcG9ydCB7IFBUX1ZFUlNJT04gfSBmcm9tIFwiQGF3cy1sYW1iZGEtcG93ZXJ0b29scy9jb21tb25zL2xpYi92ZXJzaW9uXCI7XG4vLyBpbXBvcnQgdHlwZSB7IFN1YnNlZ21lbnQgfSBmcm9tIFwiYXdzLXhyYXktc2RrLWNvcmVcIjtcbmNvbnN0IHNxcyA9IG5ldyBBV1MuU1FTKCk7XG5cbmNvbnN0IGRlZmF1bHRWYWx1ZXMgPSB7XG4gIHJlZ2lvbjogcHJvY2Vzcy5lbnYuQVdTX1JFR0lPTiB8fCBcIk4vQVwiLFxuICBleGVjdXRpb25FbnY6IHByb2Nlc3MuZW52LkFXU19FWEVDVVRJT05fRU5WIHx8IFwiTi9BXCIsXG59O1xuXG5jb25zdCBsb2dnZXIgPSBuZXcgTG9nZ2VyKHtcbiAgcGVyc2lzdGVudExvZ0F0dHJpYnV0ZXM6IHtcbiAgICAuLi5kZWZhdWx0VmFsdWVzLFxuICAgIGxvZ2dlcjoge1xuICAgICAgbmFtZTogXCJAYXdzLWxhbWJkYS1wb3dlcnRvb2xzL2xvZ2dlclwiLFxuICAgICAgdmVyc2lvbjogUFRfVkVSU0lPTixcbiAgICB9LFxuICB9LFxufSk7XG5cbmNvbnN0IG1ldHJpY3MgPSBuZXcgTWV0cmljcyh7XG4gIGRlZmF1bHREaW1lbnNpb25zOiBkZWZhdWx0VmFsdWVzLFxufSk7XG5cbmNvbnN0IHRyYWNlciA9IG5ldyBUcmFjZXIoKTtcblxuY29uc3QgZG9jQ2xpZW50ID0gbmV3IEFXUy5EeW5hbW9EQi5Eb2N1bWVudENsaWVudCgpO1xuY29uc3QgdGFibGVOYW1lID0gcHJvY2Vzcy5lbnYuVEFCTEVfTkFNRSBhcyBzdHJpbmc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYWluKFxuICBldmVudDogRHluYW1vREJTdHJlYW1FdmVudCxcbiAgY29udGV4dDogQ29udGV4dFxuKTogUHJvbWlzZTxEeW5hbW9EQlN0cmVhbUV2ZW50PiB7XG4gIC8vIExvZ2dlcjogTG9nIHRoZSBpbmNvbWluZyBldmVudFxuICBsb2dnZXIuaW5mbyhcIkxhbWJkYSBpbnZvY2F0aW9uIGV2ZW50XCIsIHsgZXZlbnQgfSk7XG5cbiAgdHJhY2VyLmFubm90YXRlQ29sZFN0YXJ0KCk7XG4gIHRyYWNlci5hZGRTZXJ2aWNlTmFtZUFubm90YXRpb24oKTtcblxuICAvLyBUcmFjZXI6IEFkZCBhd3NSZXF1ZXN0SWQgYXMgYW5ub3RhdGlvblxuICB0cmFjZXIucHV0QW5ub3RhdGlvbihcImF3c1JlcXVlc3RJZFwiLCBjb250ZXh0LmF3c1JlcXVlc3RJZCk7XG5cbiAgLy8gTWV0cmljczogQ2FwdHVyZSBjb2xkIHN0YXJ0IG1ldHJpY3NcbiAgbWV0cmljcy5jYXB0dXJlQ29sZFN0YXJ0TWV0cmljKCk7XG5cbiAgLy8gTG9nZ2VyOiBBcHBlbmQgYXdzUmVxdWVzdElkIHRvIGVhY2ggbG9nIHN0YXRlbWVudFxuICBsb2dnZXIuYXBwZW5kS2V5cyh7XG4gICAgYXdzUmVxdWVzdElkOiBjb250ZXh0LmF3c1JlcXVlc3RJZCxcbiAgfSk7XG5cbiAgaWYgKFxuICAgIGV2ZW50LlJlY29yZHNbMF0uZXZlbnROYW1lID09PSBcIklOU0VSVFwiICYmXG4gICAgZXZlbnQuUmVjb3Jkc1swXS5keW5hbW9kYj8uTmV3SW1hZ2U/LlNLLlM/LnNsaWNlKDAsIDYpID09PSBcIk9SREVSI1wiXG4gICkge1xuICAgIGxvZ2dlci5pbmZvKGBSZXNwb25zZSAke2V2ZW50LlJlY29yZHNbMF0uZXZlbnROYW1lfWAsIHtcbiAgICAgIHN0YXR1c0NvZGU6IDIwMCxcbiAgICAgIGJvZHk6IGV2ZW50LlJlY29yZHMsXG4gICAgfSk7XG5cbiAgICBjb25zdCBpZCA9IGV2ZW50LlJlY29yZHNbMF0uZHluYW1vZGI/Lk5ld0ltYWdlPy5QSy5TO1xuICAgIGNvbnN0IG9yZGVySWQgPSBldmVudC5SZWNvcmRzWzBdLmR5bmFtb2RiPy5OZXdJbWFnZT8uU0suUztcblxuICAgIGNvbnN0IGNhcnRJdGVtcyA9IGF3YWl0IGRvY0NsaWVudFxuICAgICAgLnF1ZXJ5KHtcbiAgICAgICAgVGFibGVOYW1lOiB0YWJsZU5hbWUsXG4gICAgICAgIEtleUNvbmRpdGlvbkV4cHJlc3Npb246IFwiUEsgPSA6aWQgQU5EIGJlZ2luc193aXRoKFBLLCA6c2spXCIsXG4gICAgICAgIEZpbHRlckV4cHJlc3Npb246IFwiY2FydFByb2R1Y3RTdGF0dXMgPSA6c3RhdHVzXCIsXG4gICAgICAgIFByb2plY3Rpb25FeHByZXNzaW9uOiBcInNrLCBxdWFudGl0eSwgdW5pdF9wcmljZVwiLFxuICAgICAgICBFeHByZXNzaW9uQXR0cmlidXRlVmFsdWVzOiB7XG4gICAgICAgICAgXCI6aWRcIjogaWQsXG4gICAgICAgICAgXCI6c2tcIjogXCJJVEVNI1wiLFxuICAgICAgICAgIFwiOnN0YXR1c1wiOiBcIlBFTkRJTkdcIixcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICAucHJvbWlzZSgpO1xuXG4gICAgbG9nZ2VyLmluZm8oYENhcnQgSXRlbXNgLCB7XG4gICAgICBzdGF0dXNDb2RlOiAyMDAsXG4gICAgICBib2R5OiBjYXJ0SXRlbXMsXG4gICAgfSk7XG5cbiAgICBsZXQgdG90YWxfcHJpY2UgPSAwO1xuICAgIGNhcnRJdGVtcy5JdGVtcz8uZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgdG90YWxfcHJpY2UgKz0gcGFyc2VGbG9hdChpdGVtLnVuaXRfcHJpY2UpICogcGFyc2VJbnQoaXRlbS5xdWFudGl0eSk7XG4gICAgfSk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGRvY0NsaWVudFxuICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICBUYWJsZU5hbWU6IHRhYmxlTmFtZSxcbiAgICAgICAgICBLZXk6IHtcbiAgICAgICAgICAgIFBLOiBpZCxcbiAgICAgICAgICAgIFNLOiBvcmRlcklkLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgVXBkYXRlRXhwcmVzc2lvbjpcbiAgICAgICAgICAgIFwic2V0IG9yZGVySXRlbXMgPSA6b3JkZXJJdGVtcywgb3JkZXJTdGF0dXMgPSA6c3RhdHVzLCB0b3RhbF9pdGVtcyA9IDp0b3RhbF9pdGVtcywgdG90YWxfcHJpY2UgPSA6dG90YWxfcHJpY2UsIFVwZGF0ZWRPbiA9IDp1cGRhdGVcIixcbiAgICAgICAgICBFeHByZXNzaW9uQXR0cmlidXRlVmFsdWVzOiB7XG4gICAgICAgICAgICBcIjpvcmRlckl0ZW1zXCI6IGNhcnRJdGVtcy5JdGVtcyxcbiAgICAgICAgICAgIFwiOnN0YXR1c1wiOiBcIk9SREVSRURcIixcbiAgICAgICAgICAgIFwiOnRvdGFsX2l0ZW1zXCI6IGNhcnRJdGVtcy5JdGVtcz8ubGVuZ3RoLFxuICAgICAgICAgICAgXCI6dG90YWxfcHJpY2VcIjogdG90YWxfcHJpY2UsXG4gICAgICAgICAgICBcIjp1cGRhdGVcIjogRGF0ZS5ub3coKS50b1N0cmluZygpLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG4gICAgICAgIC5wcm9taXNlKCk7XG5cbiAgICAgIGxvZ2dlci5pbmZvKGBQcm9jZXNzIE9yZGVyIFJlc3VsdGAsIHtcbiAgICAgICAgc3RhdHVzQ29kZTogMjAwLFxuICAgICAgICBib2R5OiByZXN1bHQsXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRyYWNlci5hZGRFcnJvckFzTWV0YWRhdGEoZXJyIGFzIEVycm9yKTtcbiAgICAgIGxvZ2dlci5pbmZvKGBFcnJvcmAsIHtcbiAgICAgICAgc3RhdHVzQ29kZTogNTAwLFxuICAgICAgICBlcnJvcjogZXJyLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgZXZlbnRJbmRleCA9IGV2ZW50LlJlY29yZHMubGVuZ3RoIC0gMTtcbiAgaWYgKFxuICAgIGV2ZW50LlJlY29yZHNbMF0uZXZlbnROYW1lID09PSBcIk1PRElGWVwiICYmXG4gICAgZXZlbnQuUmVjb3Jkc1swXS5keW5hbW9kYj8uTmV3SW1hZ2U/LlNLLlM/LnNsaWNlKDAsIDYpID09PSBcIk9SREVSI1wiXG4gICkge1xuICAgIGNvbnN0IG9yZGVySXRlbXMgPVxuICAgICAgZXZlbnQuUmVjb3Jkc1tldmVudEluZGV4XS5keW5hbW9kYj8uTmV3SW1hZ2U/Lm9yZGVySXRlbXM/Lkw7XG4gICAgLy8gY29uc3QgdXNlcklkID0gZXZlbnQuUmVjb3Jkc1tldmVudEluZGV4XS5keW5hbW9kYj8uTmV3SW1hZ2U/LmlkLlM7XG4gICAgbG9nZ2VyLmluZm8oXCJPcmRlciBJdGVtczogXCIsIHsgb3JkZXJJdGVtcyB9KTtcbiAgICBjb25zdCB0ZXN0ID0gYXdhaXQgc3FzXG4gICAgICAuc2VuZE1lc3NhZ2Uoe1xuICAgICAgICBRdWV1ZVVybDogcHJvY2Vzcy5lbnYuUVVFVUVfVVJMIGFzIHN0cmluZyxcbiAgICAgICAgTWVzc2FnZUJvZHk6IEpTT04uc3RyaW5naWZ5KGV2ZW50LlJlY29yZHNbMF0uZHluYW1vZGIuTmV3SW1hZ2UpLFxuICAgICAgfSlcbiAgICAgIC5wcm9taXNlKCk7XG5cbiAgICBsb2dnZXIuaW5mbyhcIkxhbWJkYSBpbnZvY2F0aW9uIGV2ZW50XCIsIHsgdGVzdCB9KTtcbiAgICByZXR1cm4gZXZlbnQ7XG4gIH1cblxuICByZXR1cm4gZXZlbnQ7XG59XG4iXX0=