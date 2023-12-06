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
const utils_1 = require("./utils");
// import type { Subsegment } from "aws-xray-sdk-core";
const sqs = new AWS.SQS();
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;
async function main(event, context) {
    // Logger: Log the incoming event
    utils_1.logger.info("Lambda invocation event", { event });
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
    if (event.Records[0].eventName === "INSERT" &&
        event.Records[0].dynamodb?.NewImage?.SK.S?.slice(0, 6) === "ORDER#") {
        utils_1.logger.info(`Response ${event.Records[0].eventName}`, {
            statusCode: 200,
            body: event.Records,
        });
        const id = event.Records[0].dynamodb?.NewImage?.PK.S;
        const orderId = event.Records[0].dynamodb?.NewImage?.SK.S;
        utils_1.logger.info(`Order Id`, {
            orderId,
            id,
        });
        const cartItems = await docClient
            .query({
            TableName: tableName,
            KeyConditionExpression: "PK = :id AND begins_with(SK, :sk)",
            FilterExpression: "cartProductStatus = :status",
            ProjectionExpression: "SK, quantity, unit_price",
            ExpressionAttributeValues: {
                ":id": id,
                ":sk": "ITEM#",
                ":status": "PENDING",
            },
        })
            .promise();
        utils_1.logger.info(`Cart Items`, {
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
            utils_1.logger.info(`Process Order Result`, {
                statusCode: 200,
                body: result,
            });
        }
        catch (err) {
            utils_1.tracer.addErrorAsMetadata(err);
            utils_1.logger.info(`Error`, {
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
        utils_1.logger.info("Order Items: ", { orderItems });
        const test = await sqs
            .sendMessage({
            QueueUrl: process.env.QUEUE_URL,
            MessageBody: JSON.stringify(event.Records[0].dynamodb.NewImage),
        })
            .promise();
        utils_1.logger.info("Lambda invocation event", { test });
        return event;
    }
    return event;
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY2Vzc09yZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicHJvY2Vzc09yZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsNkNBQStCO0FBQy9CLG1DQUFrRDtBQUNsRCx1REFBdUQ7QUFDdkQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFHMUIsTUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ3BELE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBb0IsQ0FBQztBQUU1QyxLQUFLLFVBQVUsSUFBSSxDQUN4QixLQUEwQixFQUMxQixPQUFnQjtJQUVoQixpQ0FBaUM7SUFDakMsY0FBTSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFFbEQsY0FBTSxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDM0IsY0FBTSxDQUFDLHdCQUF3QixFQUFFLENBQUM7SUFFbEMseUNBQXlDO0lBQ3pDLGNBQU0sQ0FBQyxhQUFhLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUUzRCxzQ0FBc0M7SUFDdEMsZUFBTyxDQUFDLHNCQUFzQixFQUFFLENBQUM7SUFFakMsb0RBQW9EO0lBQ3BELGNBQU0sQ0FBQyxVQUFVLENBQUM7UUFDaEIsWUFBWSxFQUFFLE9BQU8sQ0FBQyxZQUFZO0tBQ25DLENBQUMsQ0FBQztJQUVILElBQ0UsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEtBQUssUUFBUTtRQUN2QyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxL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RSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLFFBQVEsRUFDbkU7UUFDQSxNQUFNLFVBQVUsR0FDZCxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUM5RCxxRUFBcUU7UUFDckUsY0FBTSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLE1BQU0sSUFBSSxHQUFHLE1BQU0sR0FBRzthQUNuQixXQUFXLENBQUM7WUFDWCxRQUFRLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFtQjtZQUN6QyxXQUFXLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7U0FDaEUsQ0FBQzthQUNELE9BQU8sRUFBRSxDQUFDO1FBRWIsY0FBTSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDakQsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUVELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQWpIRCxvQkFpSEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEeW5hbW9EQlN0cmVhbUV2ZW50LCBDb250ZXh0IH0gZnJvbSBcImF3cy1sYW1iZGFcIjtcbmltcG9ydCAqIGFzIEFXUyBmcm9tIFwiYXdzLXNka1wiO1xuaW1wb3J0IHsgbG9nZ2VyLCBtZXRyaWNzLCB0cmFjZXIgfSBmcm9tIFwiLi91dGlsc1wiO1xuLy8gaW1wb3J0IHR5cGUgeyBTdWJzZWdtZW50IH0gZnJvbSBcImF3cy14cmF5LXNkay1jb3JlXCI7XG5jb25zdCBzcXMgPSBuZXcgQVdTLlNRUygpO1xuXG5cbmNvbnN0IGRvY0NsaWVudCA9IG5ldyBBV1MuRHluYW1vREIuRG9jdW1lbnRDbGllbnQoKTtcbmNvbnN0IHRhYmxlTmFtZSA9IHByb2Nlc3MuZW52LlRBQkxFX05BTUUgYXMgc3RyaW5nO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFpbihcbiAgZXZlbnQ6IER5bmFtb0RCU3RyZWFtRXZlbnQsXG4gIGNvbnRleHQ6IENvbnRleHRcbik6IFByb21pc2U8RHluYW1vREJTdHJlYW1FdmVudD4ge1xuICAvLyBMb2dnZXI6IExvZyB0aGUgaW5jb21pbmcgZXZlbnRcbiAgbG9nZ2VyLmluZm8oXCJMYW1iZGEgaW52b2NhdGlvbiBldmVudFwiLCB7IGV2ZW50IH0pO1xuXG4gIHRyYWNlci5hbm5vdGF0ZUNvbGRTdGFydCgpO1xuICB0cmFjZXIuYWRkU2VydmljZU5hbWVBbm5vdGF0aW9uKCk7XG5cbiAgLy8gVHJhY2VyOiBBZGQgYXdzUmVxdWVzdElkIGFzIGFubm90YXRpb25cbiAgdHJhY2VyLnB1dEFubm90YXRpb24oXCJhd3NSZXF1ZXN0SWRcIiwgY29udGV4dC5hd3NSZXF1ZXN0SWQpO1xuXG4gIC8vIE1ldHJpY3M6IENhcHR1cmUgY29sZCBzdGFydCBtZXRyaWNzXG4gIG1ldHJpY3MuY2FwdHVyZUNvbGRTdGFydE1ldHJpYygpO1xuXG4gIC8vIExvZ2dlcjogQXBwZW5kIGF3c1JlcXVlc3RJZCB0byBlYWNoIGxvZyBzdGF0ZW1lbnRcbiAgbG9nZ2VyLmFwcGVuZEtleXMoe1xuICAgIGF3c1JlcXVlc3RJZDogY29udGV4dC5hd3NSZXF1ZXN0SWQsXG4gIH0pO1xuXG4gIGlmIChcbiAgICBldmVudC5SZWNvcmRzWzBdLmV2ZW50TmFtZSA9PT0gXCJJTlNFUlRcIiAmJlxuICAgIGV2ZW50LlJlY29yZHNbMF0uZHluYW1vZGI/Lk5ld0ltYWdlPy5TSy5TPy5zbGljZSgwLCA2KSA9PT0gXCJPUkRFUiNcIlxuICApIHtcbiAgICBsb2dnZXIuaW5mbyhgUmVzcG9uc2UgJHtldmVudC5SZWNvcmRzWzBdLmV2ZW50TmFtZX1gLCB7XG4gICAgICBzdGF0dXNDb2RlOiAyMDAsXG4gICAgICBib2R5OiBldmVudC5SZWNvcmRzLFxuICAgIH0pO1xuXG4gICAgY29uc3QgaWQgPSBldmVudC5SZWNvcmRzWzBdLmR5bmFtb2RiPy5OZXdJbWFnZT8uUEsuUztcbiAgICBjb25zdCBvcmRlcklkID0gZXZlbnQuUmVjb3Jkc1swXS5keW5hbW9kYj8uTmV3SW1hZ2U/LlNLLlM7XG4gICAgbG9nZ2VyLmluZm8oYE9yZGVyIElkYCwge1xuICAgICAgb3JkZXJJZCxcbiAgICAgIGlkLFxuICAgIH0pO1xuICAgIGNvbnN0IGNhcnRJdGVtcyA9IGF3YWl0IGRvY0NsaWVudFxuICAgICAgLnF1ZXJ5KHtcbiAgICAgICAgVGFibGVOYW1lOiB0YWJsZU5hbWUsXG4gICAgICAgIEtleUNvbmRpdGlvbkV4cHJlc3Npb246IFwiUEsgPSA6aWQgQU5EIGJlZ2luc193aXRoKFNLLCA6c2spXCIsXG4gICAgICAgIEZpbHRlckV4cHJlc3Npb246IFwiY2FydFByb2R1Y3RTdGF0dXMgPSA6c3RhdHVzXCIsXG4gICAgICAgIFByb2plY3Rpb25FeHByZXNzaW9uOiBcIlNLLCBxdWFudGl0eSwgdW5pdF9wcmljZVwiLFxuICAgICAgICBFeHByZXNzaW9uQXR0cmlidXRlVmFsdWVzOiB7XG4gICAgICAgICAgXCI6aWRcIjogaWQsXG4gICAgICAgICAgXCI6c2tcIjogXCJJVEVNI1wiLFxuICAgICAgICAgIFwiOnN0YXR1c1wiOiBcIlBFTkRJTkdcIixcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICAucHJvbWlzZSgpO1xuXG4gICAgbG9nZ2VyLmluZm8oYENhcnQgSXRlbXNgLCB7XG4gICAgICBzdGF0dXNDb2RlOiAyMDAsXG4gICAgICBib2R5OiBjYXJ0SXRlbXMsXG4gICAgfSk7XG5cbiAgICBsZXQgdG90YWxfcHJpY2UgPSAwO1xuICAgIGNhcnRJdGVtcy5JdGVtcz8uZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgdG90YWxfcHJpY2UgKz0gcGFyc2VGbG9hdChpdGVtLnVuaXRfcHJpY2UpICogcGFyc2VJbnQoaXRlbS5xdWFudGl0eSk7XG4gICAgfSk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGRvY0NsaWVudFxuICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICBUYWJsZU5hbWU6IHRhYmxlTmFtZSxcbiAgICAgICAgICBLZXk6IHtcbiAgICAgICAgICAgIFBLOiBpZCxcbiAgICAgICAgICAgIFNLOiBvcmRlcklkLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgVXBkYXRlRXhwcmVzc2lvbjpcbiAgICAgICAgICAgIFwic2V0IG9yZGVySXRlbXMgPSA6b3JkZXJJdGVtcywgb3JkZXJTdGF0dXMgPSA6c3RhdHVzLCB0b3RhbF9pdGVtcyA9IDp0b3RhbF9pdGVtcywgdG90YWxfcHJpY2UgPSA6dG90YWxfcHJpY2UsIFVwZGF0ZWRPbiA9IDp1cGRhdGVcIixcbiAgICAgICAgICBFeHByZXNzaW9uQXR0cmlidXRlVmFsdWVzOiB7XG4gICAgICAgICAgICBcIjpvcmRlckl0ZW1zXCI6IGNhcnRJdGVtcy5JdGVtcyxcbiAgICAgICAgICAgIFwiOnN0YXR1c1wiOiBcIk9SREVSRURcIixcbiAgICAgICAgICAgIFwiOnRvdGFsX2l0ZW1zXCI6IGNhcnRJdGVtcy5JdGVtcz8ubGVuZ3RoLFxuICAgICAgICAgICAgXCI6dG90YWxfcHJpY2VcIjogdG90YWxfcHJpY2UsXG4gICAgICAgICAgICBcIjp1cGRhdGVcIjogRGF0ZS5ub3coKS50b1N0cmluZygpLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG4gICAgICAgIC5wcm9taXNlKCk7XG5cbiAgICAgIGxvZ2dlci5pbmZvKGBQcm9jZXNzIE9yZGVyIFJlc3VsdGAsIHtcbiAgICAgICAgc3RhdHVzQ29kZTogMjAwLFxuICAgICAgICBib2R5OiByZXN1bHQsXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRyYWNlci5hZGRFcnJvckFzTWV0YWRhdGEoZXJyIGFzIEVycm9yKTtcbiAgICAgIGxvZ2dlci5pbmZvKGBFcnJvcmAsIHtcbiAgICAgICAgc3RhdHVzQ29kZTogNTAwLFxuICAgICAgICBlcnJvcjogZXJyLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgZXZlbnRJbmRleCA9IGV2ZW50LlJlY29yZHMubGVuZ3RoIC0gMTtcbiAgaWYgKFxuICAgIGV2ZW50LlJlY29yZHNbMF0uZXZlbnROYW1lID09PSBcIk1PRElGWVwiICYmXG4gICAgZXZlbnQuUmVjb3Jkc1swXS5keW5hbW9kYj8uTmV3SW1hZ2U/LlNLLlM/LnNsaWNlKDAsIDYpID09PSBcIk9SREVSI1wiXG4gICkge1xuICAgIGNvbnN0IG9yZGVySXRlbXMgPVxuICAgICAgZXZlbnQuUmVjb3Jkc1tldmVudEluZGV4XS5keW5hbW9kYj8uTmV3SW1hZ2U/Lm9yZGVySXRlbXM/Lkw7XG4gICAgLy8gY29uc3QgdXNlcklkID0gZXZlbnQuUmVjb3Jkc1tldmVudEluZGV4XS5keW5hbW9kYj8uTmV3SW1hZ2U/LmlkLlM7XG4gICAgbG9nZ2VyLmluZm8oXCJPcmRlciBJdGVtczogXCIsIHsgb3JkZXJJdGVtcyB9KTtcbiAgICBjb25zdCB0ZXN0ID0gYXdhaXQgc3FzXG4gICAgICAuc2VuZE1lc3NhZ2Uoe1xuICAgICAgICBRdWV1ZVVybDogcHJvY2Vzcy5lbnYuUVVFVUVfVVJMIGFzIHN0cmluZyxcbiAgICAgICAgTWVzc2FnZUJvZHk6IEpTT04uc3RyaW5naWZ5KGV2ZW50LlJlY29yZHNbMF0uZHluYW1vZGIuTmV3SW1hZ2UpLFxuICAgICAgfSlcbiAgICAgIC5wcm9taXNlKCk7XG5cbiAgICBsb2dnZXIuaW5mbyhcIkxhbWJkYSBpbnZvY2F0aW9uIGV2ZW50XCIsIHsgdGVzdCB9KTtcbiAgICByZXR1cm4gZXZlbnQ7XG4gIH1cblxuICByZXR1cm4gZXZlbnQ7XG59XG4iXX0=