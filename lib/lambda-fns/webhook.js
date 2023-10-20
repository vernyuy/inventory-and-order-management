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
const AWS = __importStar(require("aws-sdk"));
const utils_1 = require("../utils");
const uuid_1 = require("uuid");
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;
module.exports.lambdaHandler = async (event, context) => {
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
    const uuid = (0, uuid_1.v4)();
    // Logger: Append uuid to each log statement
    utils_1.logger.appendKeys({ uuid });
    // Tracer: Add uuid as annotation
    utils_1.tracer.putAnnotation("uuid", uuid);
    // Metrics: Add uuid as metadata
    utils_1.metrics.addMetadata("uuid", uuid);
    const body = JSON.parse(event.body);
    console.log(body.data.object.customer_email);
    //   console.log(body.customer_email);
    const email = body.data.object.customer_email;
    const customer = await docClient
        .scan({
        TableName: tableName,
        FilterExpression: `email = :email`,
        ExpressionAttributeValues: {
            ":email": email,
        },
    })
        .promise();
    console.log(customer);
    const user = await docClient.query({
        TableName: tableName,
        KeyConditionExpression: "GSI1PK = USER",
        FilterExpression: "email = :email",
        ExpressionAttributeValues: {
            ":email": email,
        },
    });
    console.log("user:::  ", user);
    // docClient.update(
    //   {
    //     TableName: tableName,
    //     Key: {
    //       pk: user.Items[0].pk,
    //     },
    //     ConditionExpression: "userId = :email",
    //     UpdateExpression: "set cartProductStatus = :cartProductStatus",
    //     ExpressionAttributeValues: {
    //       ":cartProductStatus": "PENDING",
    //     },
    //   }
    // userId: userId,
    // productId: productId,
    // );
    return event;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViaG9vay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIndlYmhvb2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLDZDQUErQjtBQUMvQixvQ0FBbUQ7QUFFbkQsK0JBQW9DO0FBRXBDLE1BQU0sU0FBUyxHQUFHLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNwRCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQW9CLENBQUM7QUFFbkQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEdBQUcsS0FBSyxFQUNsQyxLQUFVLEVBQ1YsT0FBZ0IsRUFDZ0IsRUFBRTtJQUNsQyxjQUFNLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUVsRCxzQ0FBc0M7SUFDdEMsZUFBTyxDQUFDLHNCQUFzQixFQUFFLENBQUM7SUFFakMsbURBQW1EO0lBQ25ELE1BQU0sT0FBTyxHQUFHLGNBQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUVwQyxnRUFBZ0U7SUFDaEUsSUFBSSxjQUFzQyxDQUFDO0lBQzNDLElBQUksT0FBTyxFQUFFO1FBQ1gsY0FBYyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUN4RSxjQUFNLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0tBQ25DO0lBQ0Qsb0VBQW9FO0lBQ3BFLGNBQU0sQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzNCLGNBQU0sQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO0lBRWxDLHlDQUF5QztJQUN6QyxjQUFNLENBQUMsYUFBYSxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7SUFFM0Qsc0NBQXNDO0lBQ3RDLGVBQU8sQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO0lBRWpDLG9EQUFvRDtJQUNwRCxjQUFNLENBQUMsVUFBVSxDQUFDO1FBQ2hCLFlBQVksRUFBRSxPQUFPLENBQUMsWUFBWTtLQUNuQyxDQUFDLENBQUM7SUFFSCxNQUFNLElBQUksR0FBRyxJQUFBLFNBQU0sR0FBRSxDQUFDO0lBRXRCLDRDQUE0QztJQUM1QyxjQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUU1QixpQ0FBaUM7SUFDakMsY0FBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFFbkMsZ0NBQWdDO0lBQ2hDLGVBQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2xDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDN0Msc0NBQXNDO0lBQ3RDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQztJQUM5QyxNQUFNLFFBQVEsR0FBRyxNQUFNLFNBQVM7U0FDN0IsSUFBSSxDQUFDO1FBQ0osU0FBUyxFQUFFLFNBQVM7UUFDcEIsZ0JBQWdCLEVBQUUsZ0JBQWdCO1FBQ2xDLHlCQUF5QixFQUFFO1lBQ3pCLFFBQVEsRUFBRSxLQUFLO1NBQ2hCO0tBQ0YsQ0FBQztTQUNELE9BQU8sRUFBRSxDQUFDO0lBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN0QixNQUFNLElBQUksR0FBRyxNQUFNLFNBQVMsQ0FBQyxLQUFLLENBQUM7UUFDakMsU0FBUyxFQUFFLFNBQVM7UUFDcEIsc0JBQXNCLEVBQUUsZUFBZTtRQUN2QyxnQkFBZ0IsRUFBRSxnQkFBZ0I7UUFDbEMseUJBQXlCLEVBQUU7WUFDekIsUUFBUSxFQUFFLEtBQUs7U0FDaEI7S0FDRixDQUFDLENBQUM7SUFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUUvQixvQkFBb0I7SUFDcEIsTUFBTTtJQUNOLDRCQUE0QjtJQUM1QixhQUFhO0lBQ2IsOEJBQThCO0lBQzlCLFNBQVM7SUFDVCw4Q0FBOEM7SUFDOUMsc0VBQXNFO0lBQ3RFLG1DQUFtQztJQUNuQyx5Q0FBeUM7SUFDekMsU0FBUztJQUNULE1BQU07SUFDTixrQkFBa0I7SUFDbEIsd0JBQXdCO0lBQ3hCLEtBQUs7SUFDTCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnkgKi9cbmltcG9ydCB7IEFQSUdhdGV3YXlQcm94eVJlc3VsdCwgQ29udGV4dCB9IGZyb20gXCJhd3MtbGFtYmRhXCI7XG5pbXBvcnQgKiBhcyBBV1MgZnJvbSBcImF3cy1zZGtcIjtcbmltcG9ydCB7IGxvZ2dlciwgbWV0cmljcywgdHJhY2VyIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5pbXBvcnQgdHlwZSB7IFN1YnNlZ21lbnQgfSBmcm9tIFwiYXdzLXhyYXktc2RrLWNvcmVcIjtcbmltcG9ydCB7IHY0IGFzIHV1aWR2NCB9IGZyb20gXCJ1dWlkXCI7XG5cbmNvbnN0IGRvY0NsaWVudCA9IG5ldyBBV1MuRHluYW1vREIuRG9jdW1lbnRDbGllbnQoKTtcbmNvbnN0IHRhYmxlTmFtZSA9IHByb2Nlc3MuZW52LlRBQkxFX05BTUUgYXMgc3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cy5sYW1iZGFIYW5kbGVyID0gYXN5bmMgKFxuICBldmVudDogYW55LFxuICBjb250ZXh0OiBDb250ZXh0XG4pOiBQcm9taXNlPEFQSUdhdGV3YXlQcm94eVJlc3VsdD4gPT4ge1xuICBsb2dnZXIuaW5mbyhcIkxhbWJkYSBpbnZvY2F0aW9uIGV2ZW50XCIsIHsgZXZlbnQgfSk7XG5cbiAgLy8gTWV0cmljczogQ2FwdHVyZSBjb2xkIHN0YXJ0IG1ldHJpY3NcbiAgbWV0cmljcy5jYXB0dXJlQ29sZFN0YXJ0TWV0cmljKCk7XG5cbiAgLy8gVHJhY2VyOiBHZXQgZmFjYWRlIHNlZ21lbnQgY3JlYXRlZCBieSBBV1MgTGFtYmRhXG4gIGNvbnN0IHNlZ21lbnQgPSB0cmFjZXIuZ2V0U2VnbWVudCgpO1xuXG4gIC8vIFRyYWNlcjogQ3JlYXRlIHN1YnNlZ21lbnQgZm9yIHRoZSBmdW5jdGlvbiAmIHNldCBpdCBhcyBhY3RpdmVcbiAgbGV0IGhhbmRsZXJTZWdtZW50OiBTdWJzZWdtZW50IHwgdW5kZWZpbmVkO1xuICBpZiAoc2VnbWVudCkge1xuICAgIGhhbmRsZXJTZWdtZW50ID0gc2VnbWVudC5hZGROZXdTdWJzZWdtZW50KGAjIyAke3Byb2Nlc3MuZW52Ll9IQU5ETEVSfWApO1xuICAgIHRyYWNlci5zZXRTZWdtZW50KGhhbmRsZXJTZWdtZW50KTtcbiAgfVxuICAvLyBUcmFjZXI6IEFubm90YXRlIHRoZSBzdWJzZWdtZW50IHdpdGggdGhlIGNvbGQgc3RhcnQgJiBzZXJ2aWNlTmFtZVxuICB0cmFjZXIuYW5ub3RhdGVDb2xkU3RhcnQoKTtcbiAgdHJhY2VyLmFkZFNlcnZpY2VOYW1lQW5ub3RhdGlvbigpO1xuXG4gIC8vIFRyYWNlcjogQWRkIGF3c1JlcXVlc3RJZCBhcyBhbm5vdGF0aW9uXG4gIHRyYWNlci5wdXRBbm5vdGF0aW9uKFwiYXdzUmVxdWVzdElkXCIsIGNvbnRleHQuYXdzUmVxdWVzdElkKTtcblxuICAvLyBNZXRyaWNzOiBDYXB0dXJlIGNvbGQgc3RhcnQgbWV0cmljc1xuICBtZXRyaWNzLmNhcHR1cmVDb2xkU3RhcnRNZXRyaWMoKTtcblxuICAvLyBMb2dnZXI6IEFwcGVuZCBhd3NSZXF1ZXN0SWQgdG8gZWFjaCBsb2cgc3RhdGVtZW50XG4gIGxvZ2dlci5hcHBlbmRLZXlzKHtcbiAgICBhd3NSZXF1ZXN0SWQ6IGNvbnRleHQuYXdzUmVxdWVzdElkLFxuICB9KTtcblxuICBjb25zdCB1dWlkID0gdXVpZHY0KCk7XG5cbiAgLy8gTG9nZ2VyOiBBcHBlbmQgdXVpZCB0byBlYWNoIGxvZyBzdGF0ZW1lbnRcbiAgbG9nZ2VyLmFwcGVuZEtleXMoeyB1dWlkIH0pO1xuXG4gIC8vIFRyYWNlcjogQWRkIHV1aWQgYXMgYW5ub3RhdGlvblxuICB0cmFjZXIucHV0QW5ub3RhdGlvbihcInV1aWRcIiwgdXVpZCk7XG5cbiAgLy8gTWV0cmljczogQWRkIHV1aWQgYXMgbWV0YWRhdGFcbiAgbWV0cmljcy5hZGRNZXRhZGF0YShcInV1aWRcIiwgdXVpZCk7XG4gIGNvbnN0IGJvZHkgPSBKU09OLnBhcnNlKGV2ZW50LmJvZHkpO1xuICBjb25zb2xlLmxvZyhib2R5LmRhdGEub2JqZWN0LmN1c3RvbWVyX2VtYWlsKTtcbiAgLy8gICBjb25zb2xlLmxvZyhib2R5LmN1c3RvbWVyX2VtYWlsKTtcbiAgY29uc3QgZW1haWwgPSBib2R5LmRhdGEub2JqZWN0LmN1c3RvbWVyX2VtYWlsO1xuICBjb25zdCBjdXN0b21lciA9IGF3YWl0IGRvY0NsaWVudFxuICAgIC5zY2FuKHtcbiAgICAgIFRhYmxlTmFtZTogdGFibGVOYW1lLFxuICAgICAgRmlsdGVyRXhwcmVzc2lvbjogYGVtYWlsID0gOmVtYWlsYCxcbiAgICAgIEV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXM6IHtcbiAgICAgICAgXCI6ZW1haWxcIjogZW1haWwsXG4gICAgICB9LFxuICAgIH0pXG4gICAgLnByb21pc2UoKTtcbiAgY29uc29sZS5sb2coY3VzdG9tZXIpO1xuICBjb25zdCB1c2VyID0gYXdhaXQgZG9jQ2xpZW50LnF1ZXJ5KHtcbiAgICBUYWJsZU5hbWU6IHRhYmxlTmFtZSxcbiAgICBLZXlDb25kaXRpb25FeHByZXNzaW9uOiBcIkdTSTFQSyA9IFVTRVJcIixcbiAgICBGaWx0ZXJFeHByZXNzaW9uOiBcImVtYWlsID0gOmVtYWlsXCIsXG4gICAgRXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlczoge1xuICAgICAgXCI6ZW1haWxcIjogZW1haWwsXG4gICAgfSxcbiAgfSk7XG4gIGNvbnNvbGUubG9nKFwidXNlcjo6OiAgXCIsIHVzZXIpO1xuXG4gIC8vIGRvY0NsaWVudC51cGRhdGUoXG4gIC8vICAge1xuICAvLyAgICAgVGFibGVOYW1lOiB0YWJsZU5hbWUsXG4gIC8vICAgICBLZXk6IHtcbiAgLy8gICAgICAgcGs6IHVzZXIuSXRlbXNbMF0ucGssXG4gIC8vICAgICB9LFxuICAvLyAgICAgQ29uZGl0aW9uRXhwcmVzc2lvbjogXCJ1c2VySWQgPSA6ZW1haWxcIixcbiAgLy8gICAgIFVwZGF0ZUV4cHJlc3Npb246IFwic2V0IGNhcnRQcm9kdWN0U3RhdHVzID0gOmNhcnRQcm9kdWN0U3RhdHVzXCIsXG4gIC8vICAgICBFeHByZXNzaW9uQXR0cmlidXRlVmFsdWVzOiB7XG4gIC8vICAgICAgIFwiOmNhcnRQcm9kdWN0U3RhdHVzXCI6IFwiUEVORElOR1wiLFxuICAvLyAgICAgfSxcbiAgLy8gICB9XG4gIC8vIHVzZXJJZDogdXNlcklkLFxuICAvLyBwcm9kdWN0SWQ6IHByb2R1Y3RJZCxcbiAgLy8gKTtcbiAgcmV0dXJuIGV2ZW50O1xufTtcbiJdfQ==