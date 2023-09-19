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
// import type { Subsegment } from "aws-xray-sdk-core";
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
    return event;
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY2Vzc09yZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicHJvY2Vzc09yZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsNkNBQStCO0FBQy9CLG9DQUFtRDtBQUNuRCx1REFBdUQ7QUFFdkQsTUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ3BELE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBb0IsQ0FBQztBQUU1QyxLQUFLLFVBQVUsSUFBSSxDQUN4QixLQUEwQixFQUMxQixPQUFnQjtJQUVoQixpQ0FBaUM7SUFDakMsY0FBTSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFFbEQsY0FBTSxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDM0IsY0FBTSxDQUFDLHdCQUF3QixFQUFFLENBQUM7SUFFbEMseUNBQXlDO0lBQ3pDLGNBQU0sQ0FBQyxhQUFhLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUUzRCxzQ0FBc0M7SUFDdEMsZUFBTyxDQUFDLHNCQUFzQixFQUFFLENBQUM7SUFFakMsb0RBQW9EO0lBQ3BELGNBQU0sQ0FBQyxVQUFVLENBQUM7UUFDaEIsWUFBWSxFQUFFLE9BQU8sQ0FBQyxZQUFZO0tBQ25DLENBQUMsQ0FBQztJQUVILElBQ0UsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEtBQUssUUFBUTtRQUN2QyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLFFBQVEsRUFDbkU7UUFDQSxjQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBRTtZQUNwRCxVQUFVLEVBQUUsR0FBRztZQUNmLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTztTQUNwQixDQUFDLENBQUM7UUFFSCxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNyRCxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUUxRCxNQUFNLFNBQVMsR0FBRyxNQUFNLFNBQVM7YUFDOUIsS0FBSyxDQUFDO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsc0JBQXNCLEVBQUUsbUNBQW1DO1lBQzNELGdCQUFnQixFQUFFLDZCQUE2QjtZQUMvQyxvQkFBb0IsRUFBRSwwQkFBMEI7WUFDaEQseUJBQXlCLEVBQUU7Z0JBQ3pCLEtBQUssRUFBRSxFQUFFO2dCQUNULEtBQUssRUFBRSxPQUFPO2dCQUNkLFNBQVMsRUFBRSxTQUFTO2FBQ3JCO1NBQ0YsQ0FBQzthQUNELE9BQU8sRUFBRSxDQUFDO1FBRWIsY0FBTSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDeEIsVUFBVSxFQUFFLEdBQUc7WUFDZixJQUFJLEVBQUUsU0FBUztTQUNoQixDQUFDLENBQUM7UUFFSCxJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7UUFDcEIsU0FBUyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNoQyxXQUFXLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZFLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSTtZQUNGLE1BQU0sTUFBTSxHQUFHLE1BQU0sU0FBUztpQkFDM0IsTUFBTSxDQUFDO2dCQUNOLFNBQVMsRUFBRSxTQUFTO2dCQUNwQixHQUFHLEVBQUU7b0JBQ0gsRUFBRSxFQUFFLEVBQUU7b0JBQ04sRUFBRSxFQUFFLE9BQU87aUJBQ1o7Z0JBQ0QsZ0JBQWdCLEVBQ2Qsa0lBQWtJO2dCQUNwSSx5QkFBeUIsRUFBRTtvQkFDekIsYUFBYSxFQUFFLFNBQVMsQ0FBQyxLQUFLO29CQUM5QixTQUFTLEVBQUUsU0FBUztvQkFDcEIsY0FBYyxFQUFFLFNBQVMsQ0FBQyxLQUFLLEVBQUUsTUFBTTtvQkFDdkMsY0FBYyxFQUFFLFdBQVc7b0JBQzNCLFNBQVMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxFQUFFO2lCQUNqQzthQUNGLENBQUM7aUJBQ0QsT0FBTyxFQUFFLENBQUM7WUFFYixjQUFNLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFO2dCQUNsQyxVQUFVLEVBQUUsR0FBRztnQkFDZixJQUFJLEVBQUUsTUFBTTthQUNiLENBQUMsQ0FBQztTQUNKO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixjQUFNLENBQUMsa0JBQWtCLENBQUMsR0FBWSxDQUFDLENBQUM7WUFDeEMsY0FBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ25CLFVBQVUsRUFBRSxHQUFHO2dCQUNmLEtBQUssRUFBRSxHQUFHO2FBQ1gsQ0FBQyxDQUFDO1NBQ0o7S0FDRjtJQUVELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQTFGRCxvQkEwRkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEeW5hbW9EQlN0cmVhbUV2ZW50LCBDb250ZXh0IH0gZnJvbSBcImF3cy1sYW1iZGFcIjtcbmltcG9ydCAqIGFzIEFXUyBmcm9tIFwiYXdzLXNka1wiO1xuaW1wb3J0IHsgbG9nZ2VyLCBtZXRyaWNzLCB0cmFjZXIgfSBmcm9tIFwiLi4vdXRpbHNcIjtcbi8vIGltcG9ydCB0eXBlIHsgU3Vic2VnbWVudCB9IGZyb20gXCJhd3MteHJheS1zZGstY29yZVwiO1xuXG5jb25zdCBkb2NDbGllbnQgPSBuZXcgQVdTLkR5bmFtb0RCLkRvY3VtZW50Q2xpZW50KCk7XG5jb25zdCB0YWJsZU5hbWUgPSBwcm9jZXNzLmVudi5UQUJMRV9OQU1FIGFzIHN0cmluZztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1haW4oXG4gIGV2ZW50OiBEeW5hbW9EQlN0cmVhbUV2ZW50LFxuICBjb250ZXh0OiBDb250ZXh0XG4pOiBQcm9taXNlPER5bmFtb0RCU3RyZWFtRXZlbnQ+IHtcbiAgLy8gTG9nZ2VyOiBMb2cgdGhlIGluY29taW5nIGV2ZW50XG4gIGxvZ2dlci5pbmZvKFwiTGFtYmRhIGludm9jYXRpb24gZXZlbnRcIiwgeyBldmVudCB9KTtcblxuICB0cmFjZXIuYW5ub3RhdGVDb2xkU3RhcnQoKTtcbiAgdHJhY2VyLmFkZFNlcnZpY2VOYW1lQW5ub3RhdGlvbigpO1xuXG4gIC8vIFRyYWNlcjogQWRkIGF3c1JlcXVlc3RJZCBhcyBhbm5vdGF0aW9uXG4gIHRyYWNlci5wdXRBbm5vdGF0aW9uKFwiYXdzUmVxdWVzdElkXCIsIGNvbnRleHQuYXdzUmVxdWVzdElkKTtcblxuICAvLyBNZXRyaWNzOiBDYXB0dXJlIGNvbGQgc3RhcnQgbWV0cmljc1xuICBtZXRyaWNzLmNhcHR1cmVDb2xkU3RhcnRNZXRyaWMoKTtcblxuICAvLyBMb2dnZXI6IEFwcGVuZCBhd3NSZXF1ZXN0SWQgdG8gZWFjaCBsb2cgc3RhdGVtZW50XG4gIGxvZ2dlci5hcHBlbmRLZXlzKHtcbiAgICBhd3NSZXF1ZXN0SWQ6IGNvbnRleHQuYXdzUmVxdWVzdElkLFxuICB9KTtcblxuICBpZiAoXG4gICAgZXZlbnQuUmVjb3Jkc1swXS5ldmVudE5hbWUgPT09IFwiSU5TRVJUXCIgJiZcbiAgICBldmVudC5SZWNvcmRzWzBdLmR5bmFtb2RiPy5OZXdJbWFnZT8uU0suUz8uc2xpY2UoMCwgNikgPT09IFwiT1JERVIjXCJcbiAgKSB7XG4gICAgbG9nZ2VyLmluZm8oYFJlc3BvbnNlICR7ZXZlbnQuUmVjb3Jkc1swXS5ldmVudE5hbWV9YCwge1xuICAgICAgc3RhdHVzQ29kZTogMjAwLFxuICAgICAgYm9keTogZXZlbnQuUmVjb3JkcyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGlkID0gZXZlbnQuUmVjb3Jkc1swXS5keW5hbW9kYj8uTmV3SW1hZ2U/LlBLLlM7XG4gICAgY29uc3Qgb3JkZXJJZCA9IGV2ZW50LlJlY29yZHNbMF0uZHluYW1vZGI/Lk5ld0ltYWdlPy5TSy5TO1xuXG4gICAgY29uc3QgY2FydEl0ZW1zID0gYXdhaXQgZG9jQ2xpZW50XG4gICAgICAucXVlcnkoe1xuICAgICAgICBUYWJsZU5hbWU6IHRhYmxlTmFtZSxcbiAgICAgICAgS2V5Q29uZGl0aW9uRXhwcmVzc2lvbjogXCJQSyA9IDppZCBBTkQgYmVnaW5zX3dpdGgoUEssIDpzaylcIixcbiAgICAgICAgRmlsdGVyRXhwcmVzc2lvbjogXCJjYXJ0UHJvZHVjdFN0YXR1cyA9IDpzdGF0dXNcIixcbiAgICAgICAgUHJvamVjdGlvbkV4cHJlc3Npb246IFwic2ssIHF1YW50aXR5LCB1bml0X3ByaWNlXCIsXG4gICAgICAgIEV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXM6IHtcbiAgICAgICAgICBcIjppZFwiOiBpZCxcbiAgICAgICAgICBcIjpza1wiOiBcIklURU0jXCIsXG4gICAgICAgICAgXCI6c3RhdHVzXCI6IFwiUEVORElOR1wiLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICAgIC5wcm9taXNlKCk7XG5cbiAgICBsb2dnZXIuaW5mbyhgQ2FydCBJdGVtc2AsIHtcbiAgICAgIHN0YXR1c0NvZGU6IDIwMCxcbiAgICAgIGJvZHk6IGNhcnRJdGVtcyxcbiAgICB9KTtcblxuICAgIGxldCB0b3RhbF9wcmljZSA9IDA7XG4gICAgY2FydEl0ZW1zLkl0ZW1zPy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICB0b3RhbF9wcmljZSArPSBwYXJzZUZsb2F0KGl0ZW0udW5pdF9wcmljZSkgKiBwYXJzZUludChpdGVtLnF1YW50aXR5KTtcbiAgICB9KTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZG9jQ2xpZW50XG4gICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgIFRhYmxlTmFtZTogdGFibGVOYW1lLFxuICAgICAgICAgIEtleToge1xuICAgICAgICAgICAgUEs6IGlkLFxuICAgICAgICAgICAgU0s6IG9yZGVySWQsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBVcGRhdGVFeHByZXNzaW9uOlxuICAgICAgICAgICAgXCJzZXQgb3JkZXJJdGVtcyA9IDpvcmRlckl0ZW1zLCBvcmRlclN0YXR1cyA9IDpzdGF0dXMsIHRvdGFsX2l0ZW1zID0gOnRvdGFsX2l0ZW1zLCB0b3RhbF9wcmljZSA9IDp0b3RhbF9wcmljZSwgVXBkYXRlZE9uID0gOnVwZGF0ZVwiLFxuICAgICAgICAgIEV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXM6IHtcbiAgICAgICAgICAgIFwiOm9yZGVySXRlbXNcIjogY2FydEl0ZW1zLkl0ZW1zLFxuICAgICAgICAgICAgXCI6c3RhdHVzXCI6IFwiT1JERVJFRFwiLFxuICAgICAgICAgICAgXCI6dG90YWxfaXRlbXNcIjogY2FydEl0ZW1zLkl0ZW1zPy5sZW5ndGgsXG4gICAgICAgICAgICBcIjp0b3RhbF9wcmljZVwiOiB0b3RhbF9wcmljZSxcbiAgICAgICAgICAgIFwiOnVwZGF0ZVwiOiBEYXRlLm5vdygpLnRvU3RyaW5nKCksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcbiAgICAgICAgLnByb21pc2UoKTtcblxuICAgICAgbG9nZ2VyLmluZm8oYFByb2Nlc3MgT3JkZXIgUmVzdWx0YCwge1xuICAgICAgICBzdGF0dXNDb2RlOiAyMDAsXG4gICAgICAgIGJvZHk6IHJlc3VsdCxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdHJhY2VyLmFkZEVycm9yQXNNZXRhZGF0YShlcnIgYXMgRXJyb3IpO1xuICAgICAgbG9nZ2VyLmluZm8oYEVycm9yYCwge1xuICAgICAgICBzdGF0dXNDb2RlOiA1MDAsXG4gICAgICAgIGVycm9yOiBlcnIsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZXZlbnQ7XG59XG4iXX0=