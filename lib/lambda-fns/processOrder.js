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
const index_1 = require("../utils/index");
// import type { Subsegment } from "aws-xray-sdk-core";
const sqs = new AWS.SQS();
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;
async function main(event, context) {
    // Logger: Log the incoming event
    index_1.logger.info("Lambda invocation event", { event });
    index_1.tracer.annotateColdStart();
    index_1.tracer.addServiceNameAnnotation();
    // Tracer: Add awsRequestId as annotation
    index_1.tracer.putAnnotation("awsRequestId", context.awsRequestId);
    // Metrics: Capture cold start metrics
    index_1.metrics.captureColdStartMetric();
    // Logger: Append awsRequestId to each log statement
    index_1.logger.appendKeys({
        awsRequestId: context.awsRequestId,
    });
    if (event.Records[0].eventName === "INSERT" &&
        event.Records[0].dynamodb?.NewImage?.SK.S?.slice(0, 6) === "ORDER#") {
        index_1.logger.info(`Response ${event.Records[0].eventName}`, {
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
        index_1.logger.info(`Cart Items`, {
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
            index_1.logger.info(`Process Order Result`, {
                statusCode: 200,
                body: result,
            });
        }
        catch (err) {
            index_1.tracer.addErrorAsMetadata(err);
            index_1.logger.info(`Error`, {
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
        index_1.logger.info("Order Items: ", { orderItems });
        const test = await sqs
            .sendMessage({
            QueueUrl: process.env.QUEUE_URL,
            MessageBody: JSON.stringify(event.Records[0].dynamodb.NewImage),
        })
            .promise();
        index_1.logger.info("Lambda invocation event", { test });
        return event;
    }
    return event;
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY2Vzc09yZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicHJvY2Vzc09yZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsNkNBQStCO0FBQy9CLDBDQUF5RDtBQUN6RCx1REFBdUQ7QUFDdkQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsTUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ3BELE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBb0IsQ0FBQztBQUU1QyxLQUFLLFVBQVUsSUFBSSxDQUN4QixLQUEwQixFQUMxQixPQUFnQjtJQUVoQixpQ0FBaUM7SUFDakMsY0FBTSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFFbEQsY0FBTSxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDM0IsY0FBTSxDQUFDLHdCQUF3QixFQUFFLENBQUM7SUFFbEMseUNBQXlDO0lBQ3pDLGNBQU0sQ0FBQyxhQUFhLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUUzRCxzQ0FBc0M7SUFDdEMsZUFBTyxDQUFDLHNCQUFzQixFQUFFLENBQUM7SUFFakMsb0RBQW9EO0lBQ3BELGNBQU0sQ0FBQyxVQUFVLENBQUM7UUFDaEIsWUFBWSxFQUFFLE9BQU8sQ0FBQyxZQUFZO0tBQ25DLENBQUMsQ0FBQztJQUVILElBQ0UsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEtBQUssUUFBUTtRQUN2QyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxL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LEVBQ25FO1FBQ0EsTUFBTSxVQUFVLEdBQ2QsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDOUQscUVBQXFFO1FBQ3JFLGNBQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUM3QyxNQUFNLElBQUksR0FBRyxNQUFNLEdBQUc7YUFDbkIsV0FBVyxDQUFDO1lBQ1gsUUFBUSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBbUI7WUFDekMsV0FBVyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO1NBQ2hFLENBQUM7YUFDRCxPQUFPLEVBQUUsQ0FBQztRQUViLGNBQU0sQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ2pELE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFFRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUE5R0Qsb0JBOEdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRHluYW1vREJTdHJlYW1FdmVudCwgQ29udGV4dCB9IGZyb20gXCJhd3MtbGFtYmRhXCI7XG5pbXBvcnQgKiBhcyBBV1MgZnJvbSBcImF3cy1zZGtcIjtcbmltcG9ydCB7IGxvZ2dlciwgbWV0cmljcywgdHJhY2VyIH0gZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XG4vLyBpbXBvcnQgdHlwZSB7IFN1YnNlZ21lbnQgfSBmcm9tIFwiYXdzLXhyYXktc2RrLWNvcmVcIjtcbmNvbnN0IHNxcyA9IG5ldyBBV1MuU1FTKCk7XG5cbmNvbnN0IGRvY0NsaWVudCA9IG5ldyBBV1MuRHluYW1vREIuRG9jdW1lbnRDbGllbnQoKTtcbmNvbnN0IHRhYmxlTmFtZSA9IHByb2Nlc3MuZW52LlRBQkxFX05BTUUgYXMgc3RyaW5nO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFpbihcbiAgZXZlbnQ6IER5bmFtb0RCU3RyZWFtRXZlbnQsXG4gIGNvbnRleHQ6IENvbnRleHRcbik6IFByb21pc2U8RHluYW1vREJTdHJlYW1FdmVudD4ge1xuICAvLyBMb2dnZXI6IExvZyB0aGUgaW5jb21pbmcgZXZlbnRcbiAgbG9nZ2VyLmluZm8oXCJMYW1iZGEgaW52b2NhdGlvbiBldmVudFwiLCB7IGV2ZW50IH0pO1xuXG4gIHRyYWNlci5hbm5vdGF0ZUNvbGRTdGFydCgpO1xuICB0cmFjZXIuYWRkU2VydmljZU5hbWVBbm5vdGF0aW9uKCk7XG5cbiAgLy8gVHJhY2VyOiBBZGQgYXdzUmVxdWVzdElkIGFzIGFubm90YXRpb25cbiAgdHJhY2VyLnB1dEFubm90YXRpb24oXCJhd3NSZXF1ZXN0SWRcIiwgY29udGV4dC5hd3NSZXF1ZXN0SWQpO1xuXG4gIC8vIE1ldHJpY3M6IENhcHR1cmUgY29sZCBzdGFydCBtZXRyaWNzXG4gIG1ldHJpY3MuY2FwdHVyZUNvbGRTdGFydE1ldHJpYygpO1xuXG4gIC8vIExvZ2dlcjogQXBwZW5kIGF3c1JlcXVlc3RJZCB0byBlYWNoIGxvZyBzdGF0ZW1lbnRcbiAgbG9nZ2VyLmFwcGVuZEtleXMoe1xuICAgIGF3c1JlcXVlc3RJZDogY29udGV4dC5hd3NSZXF1ZXN0SWQsXG4gIH0pO1xuXG4gIGlmIChcbiAgICBldmVudC5SZWNvcmRzWzBdLmV2ZW50TmFtZSA9PT0gXCJJTlNFUlRcIiAmJlxuICAgIGV2ZW50LlJlY29yZHNbMF0uZHluYW1vZGI/Lk5ld0ltYWdlPy5TSy5TPy5zbGljZSgwLCA2KSA9PT0gXCJPUkRFUiNcIlxuICApIHtcbiAgICBsb2dnZXIuaW5mbyhgUmVzcG9uc2UgJHtldmVudC5SZWNvcmRzWzBdLmV2ZW50TmFtZX1gLCB7XG4gICAgICBzdGF0dXNDb2RlOiAyMDAsXG4gICAgICBib2R5OiBldmVudC5SZWNvcmRzLFxuICAgIH0pO1xuXG4gICAgY29uc3QgaWQgPSBldmVudC5SZWNvcmRzWzBdLmR5bmFtb2RiPy5OZXdJbWFnZT8uUEsuUztcbiAgICBjb25zdCBvcmRlcklkID0gZXZlbnQuUmVjb3Jkc1swXS5keW5hbW9kYj8uTmV3SW1hZ2U/LlNLLlM7XG5cbiAgICBjb25zdCBjYXJ0SXRlbXMgPSBhd2FpdCBkb2NDbGllbnRcbiAgICAgIC5xdWVyeSh7XG4gICAgICAgIFRhYmxlTmFtZTogdGFibGVOYW1lLFxuICAgICAgICBLZXlDb25kaXRpb25FeHByZXNzaW9uOiBcIlBLID0gOmlkIEFORCBiZWdpbnNfd2l0aChQSywgOnNrKVwiLFxuICAgICAgICBGaWx0ZXJFeHByZXNzaW9uOiBcImNhcnRQcm9kdWN0U3RhdHVzID0gOnN0YXR1c1wiLFxuICAgICAgICBQcm9qZWN0aW9uRXhwcmVzc2lvbjogXCJzaywgcXVhbnRpdHksIHVuaXRfcHJpY2VcIixcbiAgICAgICAgRXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlczoge1xuICAgICAgICAgIFwiOmlkXCI6IGlkLFxuICAgICAgICAgIFwiOnNrXCI6IFwiSVRFTSNcIixcbiAgICAgICAgICBcIjpzdGF0dXNcIjogXCJQRU5ESU5HXCIsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgLnByb21pc2UoKTtcblxuICAgIGxvZ2dlci5pbmZvKGBDYXJ0IEl0ZW1zYCwge1xuICAgICAgc3RhdHVzQ29kZTogMjAwLFxuICAgICAgYm9keTogY2FydEl0ZW1zLFxuICAgIH0pO1xuXG4gICAgbGV0IHRvdGFsX3ByaWNlID0gMDtcbiAgICBjYXJ0SXRlbXMuSXRlbXM/LmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIHRvdGFsX3ByaWNlICs9IHBhcnNlRmxvYXQoaXRlbS51bml0X3ByaWNlKSAqIHBhcnNlSW50KGl0ZW0ucXVhbnRpdHkpO1xuICAgIH0pO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBkb2NDbGllbnRcbiAgICAgICAgLnVwZGF0ZSh7XG4gICAgICAgICAgVGFibGVOYW1lOiB0YWJsZU5hbWUsXG4gICAgICAgICAgS2V5OiB7XG4gICAgICAgICAgICBQSzogaWQsXG4gICAgICAgICAgICBTSzogb3JkZXJJZCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFVwZGF0ZUV4cHJlc3Npb246XG4gICAgICAgICAgICBcInNldCBvcmRlckl0ZW1zID0gOm9yZGVySXRlbXMsIG9yZGVyU3RhdHVzID0gOnN0YXR1cywgdG90YWxfaXRlbXMgPSA6dG90YWxfaXRlbXMsIHRvdGFsX3ByaWNlID0gOnRvdGFsX3ByaWNlLCBVcGRhdGVkT24gPSA6dXBkYXRlXCIsXG4gICAgICAgICAgRXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlczoge1xuICAgICAgICAgICAgXCI6b3JkZXJJdGVtc1wiOiBjYXJ0SXRlbXMuSXRlbXMsXG4gICAgICAgICAgICBcIjpzdGF0dXNcIjogXCJPUkRFUkVEXCIsXG4gICAgICAgICAgICBcIjp0b3RhbF9pdGVtc1wiOiBjYXJ0SXRlbXMuSXRlbXM/Lmxlbmd0aCxcbiAgICAgICAgICAgIFwiOnRvdGFsX3ByaWNlXCI6IHRvdGFsX3ByaWNlLFxuICAgICAgICAgICAgXCI6dXBkYXRlXCI6IERhdGUubm93KCkudG9TdHJpbmcoKSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuICAgICAgICAucHJvbWlzZSgpO1xuXG4gICAgICBsb2dnZXIuaW5mbyhgUHJvY2VzcyBPcmRlciBSZXN1bHRgLCB7XG4gICAgICAgIHN0YXR1c0NvZGU6IDIwMCxcbiAgICAgICAgYm9keTogcmVzdWx0LFxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0cmFjZXIuYWRkRXJyb3JBc01ldGFkYXRhKGVyciBhcyBFcnJvcik7XG4gICAgICBsb2dnZXIuaW5mbyhgRXJyb3JgLCB7XG4gICAgICAgIHN0YXR1c0NvZGU6IDUwMCxcbiAgICAgICAgZXJyb3I6IGVycixcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGV2ZW50SW5kZXggPSBldmVudC5SZWNvcmRzLmxlbmd0aCAtIDE7XG4gIGlmIChcbiAgICBldmVudC5SZWNvcmRzWzBdLmV2ZW50TmFtZSA9PT0gXCJNT0RJRllcIiAmJlxuICAgIGV2ZW50LlJlY29yZHNbMF0uZHluYW1vZGI/Lk5ld0ltYWdlPy5TSy5TPy5zbGljZSgwLCA2KSA9PT0gXCJPUkRFUiNcIlxuICApIHtcbiAgICBjb25zdCBvcmRlckl0ZW1zID1cbiAgICAgIGV2ZW50LlJlY29yZHNbZXZlbnRJbmRleF0uZHluYW1vZGI/Lk5ld0ltYWdlPy5vcmRlckl0ZW1zPy5MO1xuICAgIC8vIGNvbnN0IHVzZXJJZCA9IGV2ZW50LlJlY29yZHNbZXZlbnRJbmRleF0uZHluYW1vZGI/Lk5ld0ltYWdlPy5pZC5TO1xuICAgIGxvZ2dlci5pbmZvKFwiT3JkZXIgSXRlbXM6IFwiLCB7IG9yZGVySXRlbXMgfSk7XG4gICAgY29uc3QgdGVzdCA9IGF3YWl0IHNxc1xuICAgICAgLnNlbmRNZXNzYWdlKHtcbiAgICAgICAgUXVldWVVcmw6IHByb2Nlc3MuZW52LlFVRVVFX1VSTCBhcyBzdHJpbmcsXG4gICAgICAgIE1lc3NhZ2VCb2R5OiBKU09OLnN0cmluZ2lmeShldmVudC5SZWNvcmRzWzBdLmR5bmFtb2RiLk5ld0ltYWdlKSxcbiAgICAgIH0pXG4gICAgICAucHJvbWlzZSgpO1xuXG4gICAgbG9nZ2VyLmluZm8oXCJMYW1iZGEgaW52b2NhdGlvbiBldmVudFwiLCB7IHRlc3QgfSk7XG4gICAgcmV0dXJuIGV2ZW50O1xuICB9XG5cbiAgcmV0dXJuIGV2ZW50O1xufVxuIl19