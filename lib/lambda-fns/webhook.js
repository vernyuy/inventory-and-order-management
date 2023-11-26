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
    // const customer = await docClient
    //   .scan({
    //     TableName: tableName,
    //     FilterExpression: `email = :email`,
    //     ExpressionAttributeValues: {
    //       ":email": email,
    //     },
    //   })
    //   .promise();
    // console.log(customer);
    const user = docClient.query({
        TableName: tableName,
        KeyConditionExpression: "UserInventoryIndexPK = USER",
        FilterExpression: "email = :email",
        ExpressionAttributeValues: {
            ":email": email,
        },
    });
    console.log("user:::  ", user);
    const paymentStatus = docClient.update({
        TableName: tableName,
        Key: {
            pk: user?.Items[0].pk,
        },
        ConditionExpression: "PK = :email",
        UpdateExpression: "set orderStatus = :orderStatus",
        ExpressionAttributeValues: {
            ":orderStatus": "PAYED",
            ":userPK": user.Items[0].PK,
        },
    });
    return paymentStatus;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViaG9vay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIndlYmhvb2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLDZDQUErQjtBQUMvQixvQ0FBbUQ7QUFFbkQsK0JBQW9DO0FBRXBDLE1BQU0sU0FBUyxHQUFHLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNwRCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQW9CLENBQUM7QUFFbkQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEdBQUcsS0FBSyxFQUNsQyxLQUFVLEVBQ1YsT0FBZ0IsRUFDZ0IsRUFBRTtJQUNsQyxjQUFNLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUVsRCxzQ0FBc0M7SUFDdEMsZUFBTyxDQUFDLHNCQUFzQixFQUFFLENBQUM7SUFFakMsbURBQW1EO0lBQ25ELE1BQU0sT0FBTyxHQUFHLGNBQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUVwQyxnRUFBZ0U7SUFDaEUsSUFBSSxjQUFzQyxDQUFDO0lBQzNDLElBQUksT0FBTyxFQUFFO1FBQ1gsY0FBYyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUN4RSxjQUFNLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0tBQ25DO0lBQ0Qsb0VBQW9FO0lBQ3BFLGNBQU0sQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzNCLGNBQU0sQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO0lBRWxDLHlDQUF5QztJQUN6QyxjQUFNLENBQUMsYUFBYSxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7SUFFM0Qsc0NBQXNDO0lBQ3RDLGVBQU8sQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO0lBRWpDLG9EQUFvRDtJQUNwRCxjQUFNLENBQUMsVUFBVSxDQUFDO1FBQ2hCLFlBQVksRUFBRSxPQUFPLENBQUMsWUFBWTtLQUNuQyxDQUFDLENBQUM7SUFFSCxNQUFNLElBQUksR0FBRyxJQUFBLFNBQU0sR0FBRSxDQUFDO0lBRXRCLDRDQUE0QztJQUM1QyxjQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUU1QixpQ0FBaUM7SUFDakMsY0FBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFFbkMsZ0NBQWdDO0lBQ2hDLGVBQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2xDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDN0Msc0NBQXNDO0lBQ3RDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQztJQUM5QyxtQ0FBbUM7SUFDbkMsWUFBWTtJQUNaLDRCQUE0QjtJQUM1QiwwQ0FBMEM7SUFDMUMsbUNBQW1DO0lBQ25DLHlCQUF5QjtJQUN6QixTQUFTO0lBQ1QsT0FBTztJQUNQLGdCQUFnQjtJQUNoQix5QkFBeUI7SUFDekIsTUFBTSxJQUFJLEdBQVEsU0FBUyxDQUFDLEtBQUssQ0FBQztRQUNoQyxTQUFTLEVBQUUsU0FBUztRQUNwQixzQkFBc0IsRUFBRSw2QkFBNkI7UUFDckQsZ0JBQWdCLEVBQUUsZ0JBQWdCO1FBQ2xDLHlCQUF5QixFQUFFO1lBQ3pCLFFBQVEsRUFBRSxLQUFLO1NBQ2hCO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFFL0IsTUFBTSxhQUFhLEdBQVEsU0FBUyxDQUFDLE1BQU0sQ0FBQztRQUMxQyxTQUFTLEVBQUUsU0FBUztRQUNwQixHQUFHLEVBQUU7WUFDSCxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1NBQ3RCO1FBQ0QsbUJBQW1CLEVBQUUsYUFBYTtRQUNsQyxnQkFBZ0IsRUFBRSxnQ0FBZ0M7UUFDbEQseUJBQXlCLEVBQUU7WUFDekIsY0FBYyxFQUFFLE9BQU87WUFDdkIsU0FBUyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtTQUM1QjtLQUNGLENBQUMsQ0FBQztJQUNILE9BQU8sYUFBYSxDQUFDO0FBQ3ZCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnkgKi9cbmltcG9ydCB7IEFQSUdhdGV3YXlQcm94eVJlc3VsdCwgQ29udGV4dCB9IGZyb20gXCJhd3MtbGFtYmRhXCI7XG5pbXBvcnQgKiBhcyBBV1MgZnJvbSBcImF3cy1zZGtcIjtcbmltcG9ydCB7IGxvZ2dlciwgbWV0cmljcywgdHJhY2VyIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5pbXBvcnQgdHlwZSB7IFN1YnNlZ21lbnQgfSBmcm9tIFwiYXdzLXhyYXktc2RrLWNvcmVcIjtcbmltcG9ydCB7IHY0IGFzIHV1aWR2NCB9IGZyb20gXCJ1dWlkXCI7XG5cbmNvbnN0IGRvY0NsaWVudCA9IG5ldyBBV1MuRHluYW1vREIuRG9jdW1lbnRDbGllbnQoKTtcbmNvbnN0IHRhYmxlTmFtZSA9IHByb2Nlc3MuZW52LlRBQkxFX05BTUUgYXMgc3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cy5sYW1iZGFIYW5kbGVyID0gYXN5bmMgKFxuICBldmVudDogYW55LFxuICBjb250ZXh0OiBDb250ZXh0XG4pOiBQcm9taXNlPEFQSUdhdGV3YXlQcm94eVJlc3VsdD4gPT4ge1xuICBsb2dnZXIuaW5mbyhcIkxhbWJkYSBpbnZvY2F0aW9uIGV2ZW50XCIsIHsgZXZlbnQgfSk7XG5cbiAgLy8gTWV0cmljczogQ2FwdHVyZSBjb2xkIHN0YXJ0IG1ldHJpY3NcbiAgbWV0cmljcy5jYXB0dXJlQ29sZFN0YXJ0TWV0cmljKCk7XG5cbiAgLy8gVHJhY2VyOiBHZXQgZmFjYWRlIHNlZ21lbnQgY3JlYXRlZCBieSBBV1MgTGFtYmRhXG4gIGNvbnN0IHNlZ21lbnQgPSB0cmFjZXIuZ2V0U2VnbWVudCgpO1xuXG4gIC8vIFRyYWNlcjogQ3JlYXRlIHN1YnNlZ21lbnQgZm9yIHRoZSBmdW5jdGlvbiAmIHNldCBpdCBhcyBhY3RpdmVcbiAgbGV0IGhhbmRsZXJTZWdtZW50OiBTdWJzZWdtZW50IHwgdW5kZWZpbmVkO1xuICBpZiAoc2VnbWVudCkge1xuICAgIGhhbmRsZXJTZWdtZW50ID0gc2VnbWVudC5hZGROZXdTdWJzZWdtZW50KGAjIyAke3Byb2Nlc3MuZW52Ll9IQU5ETEVSfWApO1xuICAgIHRyYWNlci5zZXRTZWdtZW50KGhhbmRsZXJTZWdtZW50KTtcbiAgfVxuICAvLyBUcmFjZXI6IEFubm90YXRlIHRoZSBzdWJzZWdtZW50IHdpdGggdGhlIGNvbGQgc3RhcnQgJiBzZXJ2aWNlTmFtZVxuICB0cmFjZXIuYW5ub3RhdGVDb2xkU3RhcnQoKTtcbiAgdHJhY2VyLmFkZFNlcnZpY2VOYW1lQW5ub3RhdGlvbigpO1xuXG4gIC8vIFRyYWNlcjogQWRkIGF3c1JlcXVlc3RJZCBhcyBhbm5vdGF0aW9uXG4gIHRyYWNlci5wdXRBbm5vdGF0aW9uKFwiYXdzUmVxdWVzdElkXCIsIGNvbnRleHQuYXdzUmVxdWVzdElkKTtcblxuICAvLyBNZXRyaWNzOiBDYXB0dXJlIGNvbGQgc3RhcnQgbWV0cmljc1xuICBtZXRyaWNzLmNhcHR1cmVDb2xkU3RhcnRNZXRyaWMoKTtcblxuICAvLyBMb2dnZXI6IEFwcGVuZCBhd3NSZXF1ZXN0SWQgdG8gZWFjaCBsb2cgc3RhdGVtZW50XG4gIGxvZ2dlci5hcHBlbmRLZXlzKHtcbiAgICBhd3NSZXF1ZXN0SWQ6IGNvbnRleHQuYXdzUmVxdWVzdElkLFxuICB9KTtcblxuICBjb25zdCB1dWlkID0gdXVpZHY0KCk7XG5cbiAgLy8gTG9nZ2VyOiBBcHBlbmQgdXVpZCB0byBlYWNoIGxvZyBzdGF0ZW1lbnRcbiAgbG9nZ2VyLmFwcGVuZEtleXMoeyB1dWlkIH0pO1xuXG4gIC8vIFRyYWNlcjogQWRkIHV1aWQgYXMgYW5ub3RhdGlvblxuICB0cmFjZXIucHV0QW5ub3RhdGlvbihcInV1aWRcIiwgdXVpZCk7XG5cbiAgLy8gTWV0cmljczogQWRkIHV1aWQgYXMgbWV0YWRhdGFcbiAgbWV0cmljcy5hZGRNZXRhZGF0YShcInV1aWRcIiwgdXVpZCk7XG4gIGNvbnN0IGJvZHkgPSBKU09OLnBhcnNlKGV2ZW50LmJvZHkpO1xuICBjb25zb2xlLmxvZyhib2R5LmRhdGEub2JqZWN0LmN1c3RvbWVyX2VtYWlsKTtcbiAgLy8gICBjb25zb2xlLmxvZyhib2R5LmN1c3RvbWVyX2VtYWlsKTtcbiAgY29uc3QgZW1haWwgPSBib2R5LmRhdGEub2JqZWN0LmN1c3RvbWVyX2VtYWlsO1xuICAvLyBjb25zdCBjdXN0b21lciA9IGF3YWl0IGRvY0NsaWVudFxuICAvLyAgIC5zY2FuKHtcbiAgLy8gICAgIFRhYmxlTmFtZTogdGFibGVOYW1lLFxuICAvLyAgICAgRmlsdGVyRXhwcmVzc2lvbjogYGVtYWlsID0gOmVtYWlsYCxcbiAgLy8gICAgIEV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXM6IHtcbiAgLy8gICAgICAgXCI6ZW1haWxcIjogZW1haWwsXG4gIC8vICAgICB9LFxuICAvLyAgIH0pXG4gIC8vICAgLnByb21pc2UoKTtcbiAgLy8gY29uc29sZS5sb2coY3VzdG9tZXIpO1xuICBjb25zdCB1c2VyOiBhbnkgPSBkb2NDbGllbnQucXVlcnkoe1xuICAgIFRhYmxlTmFtZTogdGFibGVOYW1lLFxuICAgIEtleUNvbmRpdGlvbkV4cHJlc3Npb246IFwiVXNlckludmVudG9yeUluZGV4UEsgPSBVU0VSXCIsXG4gICAgRmlsdGVyRXhwcmVzc2lvbjogXCJlbWFpbCA9IDplbWFpbFwiLFxuICAgIEV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXM6IHtcbiAgICAgIFwiOmVtYWlsXCI6IGVtYWlsLFxuICAgIH0sXG4gIH0pO1xuICBjb25zb2xlLmxvZyhcInVzZXI6OjogIFwiLCB1c2VyKTtcblxuICBjb25zdCBwYXltZW50U3RhdHVzOiBhbnkgPSBkb2NDbGllbnQudXBkYXRlKHtcbiAgICBUYWJsZU5hbWU6IHRhYmxlTmFtZSxcbiAgICBLZXk6IHtcbiAgICAgIHBrOiB1c2VyPy5JdGVtc1swXS5wayxcbiAgICB9LFxuICAgIENvbmRpdGlvbkV4cHJlc3Npb246IFwiUEsgPSA6ZW1haWxcIixcbiAgICBVcGRhdGVFeHByZXNzaW9uOiBcInNldCBvcmRlclN0YXR1cyA9IDpvcmRlclN0YXR1c1wiLFxuICAgIEV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXM6IHtcbiAgICAgIFwiOm9yZGVyU3RhdHVzXCI6IFwiUEFZRURcIixcbiAgICAgIFwiOnVzZXJQS1wiOiB1c2VyLkl0ZW1zWzBdLlBLLFxuICAgIH0sXG4gIH0pO1xuICByZXR1cm4gcGF5bWVudFN0YXR1cztcbn07XG4iXX0=