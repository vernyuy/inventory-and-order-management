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
const logger_1 = require("@aws-lambda-powertools/logger");
const metrics_1 = require("@aws-lambda-powertools/metrics");
const tracer_1 = require("@aws-lambda-powertools/tracer");
const version_1 = require("@aws-lambda-powertools/commons/lib/version");
const uuid_1 = require("uuid");
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;
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
module.exports.lambdaHandler = async (event, context) => {
    logger.info("Lambda invocation event", { event });
    // Metrics: Capture cold start metrics
    metrics.captureColdStartMetric();
    // Tracer: Get facade segment created by AWS Lambda
    const segment = tracer.getSegment();
    // Tracer: Create subsegment for the function & set it as active
    let handlerSegment;
    if (segment) {
        handlerSegment = segment.addNewSubsegment(`## ${process.env._HANDLER}`);
        tracer.setSegment(handlerSegment);
    }
    // Tracer: Annotate the subsegment with the cold start & serviceName
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
    const uuid = (0, uuid_1.v4)();
    // Logger: Append uuid to each log statement
    logger.appendKeys({ uuid });
    // Tracer: Add uuid as annotation
    tracer.putAnnotation("uuid", uuid);
    // Metrics: Add uuid as metadata
    metrics.addMetadata("uuid", uuid);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViaG9vay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIndlYmhvb2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLDZDQUErQjtBQUUvQiwwREFBdUQ7QUFDdkQsNERBQXlEO0FBQ3pELDBEQUF1RDtBQUN2RCx3RUFBd0U7QUFDeEUsK0JBQW9DO0FBRXBDLE1BQU0sU0FBUyxHQUFHLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNwRCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQW9CLENBQUM7QUFFbkQsTUFBTSxhQUFhLEdBQUc7SUFDcEIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLEtBQUs7SUFDdkMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLElBQUksS0FBSztDQUNyRCxDQUFDO0FBRUYsTUFBTSxNQUFNLEdBQUcsSUFBSSxlQUFNLENBQUM7SUFDeEIsdUJBQXVCLEVBQUU7UUFDdkIsR0FBRyxhQUFhO1FBQ2hCLE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSwrQkFBK0I7WUFDckMsT0FBTyxFQUFFLG9CQUFVO1NBQ3BCO0tBQ0Y7Q0FDRixDQUFDLENBQUM7QUFFSCxNQUFNLE9BQU8sR0FBRyxJQUFJLGlCQUFPLENBQUM7SUFDMUIsaUJBQWlCLEVBQUUsYUFBYTtDQUNqQyxDQUFDLENBQUM7QUFFSCxNQUFNLE1BQU0sR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDO0FBRTVCLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxHQUFHLEtBQUssRUFDbEMsS0FBVSxFQUNWLE9BQWdCLEVBQ2dCLEVBQUU7SUFDbEMsTUFBTSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFFbEQsc0NBQXNDO0lBQ3RDLE9BQU8sQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO0lBRWpDLG1EQUFtRDtJQUNuRCxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7SUFFcEMsZ0VBQWdFO0lBQ2hFLElBQUksY0FBc0MsQ0FBQztJQUMzQyxJQUFJLE9BQU8sRUFBRTtRQUNYLGNBQWMsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDeEUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQztLQUNuQztJQUNELG9FQUFvRTtJQUNwRSxNQUFNLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUMzQixNQUFNLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztJQUVsQyx5Q0FBeUM7SUFDekMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBRTNELHNDQUFzQztJQUN0QyxPQUFPLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztJQUVqQyxvREFBb0Q7SUFDcEQsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUNoQixZQUFZLEVBQUUsT0FBTyxDQUFDLFlBQVk7S0FDbkMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxJQUFJLEdBQUcsSUFBQSxTQUFNLEdBQUUsQ0FBQztJQUV0Qiw0Q0FBNEM7SUFDNUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFFNUIsaUNBQWlDO0lBQ2pDLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBRW5DLGdDQUFnQztJQUNoQyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNsQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzdDLHNDQUFzQztJQUN0QyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUM7SUFDOUMsbUNBQW1DO0lBQ25DLFlBQVk7SUFDWiw0QkFBNEI7SUFDNUIsMENBQTBDO0lBQzFDLG1DQUFtQztJQUNuQyx5QkFBeUI7SUFDekIsU0FBUztJQUNULE9BQU87SUFDUCxnQkFBZ0I7SUFDaEIseUJBQXlCO0lBQ3pCLE1BQU0sSUFBSSxHQUFRLFNBQVMsQ0FBQyxLQUFLLENBQUM7UUFDaEMsU0FBUyxFQUFFLFNBQVM7UUFDcEIsc0JBQXNCLEVBQUUsNkJBQTZCO1FBQ3JELGdCQUFnQixFQUFFLGdCQUFnQjtRQUNsQyx5QkFBeUIsRUFBRTtZQUN6QixRQUFRLEVBQUUsS0FBSztTQUNoQjtLQUNGLENBQUMsQ0FBQztJQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBRS9CLE1BQU0sYUFBYSxHQUFRLFNBQVMsQ0FBQyxNQUFNLENBQUM7UUFDMUMsU0FBUyxFQUFFLFNBQVM7UUFDcEIsR0FBRyxFQUFFO1lBQ0gsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtTQUN0QjtRQUNELG1CQUFtQixFQUFFLGFBQWE7UUFDbEMsZ0JBQWdCLEVBQUUsZ0NBQWdDO1FBQ2xELHlCQUF5QixFQUFFO1lBQ3pCLGNBQWMsRUFBRSxPQUFPO1lBQ3ZCLFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7U0FDNUI7S0FDRixDQUFDLENBQUM7SUFDSCxPQUFPLGFBQWEsQ0FBQztBQUN2QixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55ICovXG5pbXBvcnQgeyBBUElHYXRld2F5UHJveHlSZXN1bHQsIENvbnRleHQgfSBmcm9tIFwiYXdzLWxhbWJkYVwiO1xuaW1wb3J0ICogYXMgQVdTIGZyb20gXCJhd3Mtc2RrXCI7XG5pbXBvcnQgdHlwZSB7IFN1YnNlZ21lbnQgfSBmcm9tIFwiYXdzLXhyYXktc2RrLWNvcmVcIjtcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gXCJAYXdzLWxhbWJkYS1wb3dlcnRvb2xzL2xvZ2dlclwiO1xuaW1wb3J0IHsgTWV0cmljcyB9IGZyb20gXCJAYXdzLWxhbWJkYS1wb3dlcnRvb2xzL21ldHJpY3NcIjtcbmltcG9ydCB7IFRyYWNlciB9IGZyb20gXCJAYXdzLWxhbWJkYS1wb3dlcnRvb2xzL3RyYWNlclwiO1xuaW1wb3J0IHsgUFRfVkVSU0lPTiB9IGZyb20gXCJAYXdzLWxhbWJkYS1wb3dlcnRvb2xzL2NvbW1vbnMvbGliL3ZlcnNpb25cIjtcbmltcG9ydCB7IHY0IGFzIHV1aWR2NCB9IGZyb20gXCJ1dWlkXCI7XG5cbmNvbnN0IGRvY0NsaWVudCA9IG5ldyBBV1MuRHluYW1vREIuRG9jdW1lbnRDbGllbnQoKTtcbmNvbnN0IHRhYmxlTmFtZSA9IHByb2Nlc3MuZW52LlRBQkxFX05BTUUgYXMgc3RyaW5nO1xuXG5jb25zdCBkZWZhdWx0VmFsdWVzID0ge1xuICByZWdpb246IHByb2Nlc3MuZW52LkFXU19SRUdJT04gfHwgXCJOL0FcIixcbiAgZXhlY3V0aW9uRW52OiBwcm9jZXNzLmVudi5BV1NfRVhFQ1VUSU9OX0VOViB8fCBcIk4vQVwiLFxufTtcblxuY29uc3QgbG9nZ2VyID0gbmV3IExvZ2dlcih7XG4gIHBlcnNpc3RlbnRMb2dBdHRyaWJ1dGVzOiB7XG4gICAgLi4uZGVmYXVsdFZhbHVlcyxcbiAgICBsb2dnZXI6IHtcbiAgICAgIG5hbWU6IFwiQGF3cy1sYW1iZGEtcG93ZXJ0b29scy9sb2dnZXJcIixcbiAgICAgIHZlcnNpb246IFBUX1ZFUlNJT04sXG4gICAgfSxcbiAgfSxcbn0pO1xuXG5jb25zdCBtZXRyaWNzID0gbmV3IE1ldHJpY3Moe1xuICBkZWZhdWx0RGltZW5zaW9uczogZGVmYXVsdFZhbHVlcyxcbn0pO1xuXG5jb25zdCB0cmFjZXIgPSBuZXcgVHJhY2VyKCk7XG5cbm1vZHVsZS5leHBvcnRzLmxhbWJkYUhhbmRsZXIgPSBhc3luYyAoXG4gIGV2ZW50OiBhbnksXG4gIGNvbnRleHQ6IENvbnRleHRcbik6IFByb21pc2U8QVBJR2F0ZXdheVByb3h5UmVzdWx0PiA9PiB7XG4gIGxvZ2dlci5pbmZvKFwiTGFtYmRhIGludm9jYXRpb24gZXZlbnRcIiwgeyBldmVudCB9KTtcblxuICAvLyBNZXRyaWNzOiBDYXB0dXJlIGNvbGQgc3RhcnQgbWV0cmljc1xuICBtZXRyaWNzLmNhcHR1cmVDb2xkU3RhcnRNZXRyaWMoKTtcblxuICAvLyBUcmFjZXI6IEdldCBmYWNhZGUgc2VnbWVudCBjcmVhdGVkIGJ5IEFXUyBMYW1iZGFcbiAgY29uc3Qgc2VnbWVudCA9IHRyYWNlci5nZXRTZWdtZW50KCk7XG5cbiAgLy8gVHJhY2VyOiBDcmVhdGUgc3Vic2VnbWVudCBmb3IgdGhlIGZ1bmN0aW9uICYgc2V0IGl0IGFzIGFjdGl2ZVxuICBsZXQgaGFuZGxlclNlZ21lbnQ6IFN1YnNlZ21lbnQgfCB1bmRlZmluZWQ7XG4gIGlmIChzZWdtZW50KSB7XG4gICAgaGFuZGxlclNlZ21lbnQgPSBzZWdtZW50LmFkZE5ld1N1YnNlZ21lbnQoYCMjICR7cHJvY2Vzcy5lbnYuX0hBTkRMRVJ9YCk7XG4gICAgdHJhY2VyLnNldFNlZ21lbnQoaGFuZGxlclNlZ21lbnQpO1xuICB9XG4gIC8vIFRyYWNlcjogQW5ub3RhdGUgdGhlIHN1YnNlZ21lbnQgd2l0aCB0aGUgY29sZCBzdGFydCAmIHNlcnZpY2VOYW1lXG4gIHRyYWNlci5hbm5vdGF0ZUNvbGRTdGFydCgpO1xuICB0cmFjZXIuYWRkU2VydmljZU5hbWVBbm5vdGF0aW9uKCk7XG5cbiAgLy8gVHJhY2VyOiBBZGQgYXdzUmVxdWVzdElkIGFzIGFubm90YXRpb25cbiAgdHJhY2VyLnB1dEFubm90YXRpb24oXCJhd3NSZXF1ZXN0SWRcIiwgY29udGV4dC5hd3NSZXF1ZXN0SWQpO1xuXG4gIC8vIE1ldHJpY3M6IENhcHR1cmUgY29sZCBzdGFydCBtZXRyaWNzXG4gIG1ldHJpY3MuY2FwdHVyZUNvbGRTdGFydE1ldHJpYygpO1xuXG4gIC8vIExvZ2dlcjogQXBwZW5kIGF3c1JlcXVlc3RJZCB0byBlYWNoIGxvZyBzdGF0ZW1lbnRcbiAgbG9nZ2VyLmFwcGVuZEtleXMoe1xuICAgIGF3c1JlcXVlc3RJZDogY29udGV4dC5hd3NSZXF1ZXN0SWQsXG4gIH0pO1xuXG4gIGNvbnN0IHV1aWQgPSB1dWlkdjQoKTtcblxuICAvLyBMb2dnZXI6IEFwcGVuZCB1dWlkIHRvIGVhY2ggbG9nIHN0YXRlbWVudFxuICBsb2dnZXIuYXBwZW5kS2V5cyh7IHV1aWQgfSk7XG5cbiAgLy8gVHJhY2VyOiBBZGQgdXVpZCBhcyBhbm5vdGF0aW9uXG4gIHRyYWNlci5wdXRBbm5vdGF0aW9uKFwidXVpZFwiLCB1dWlkKTtcblxuICAvLyBNZXRyaWNzOiBBZGQgdXVpZCBhcyBtZXRhZGF0YVxuICBtZXRyaWNzLmFkZE1ldGFkYXRhKFwidXVpZFwiLCB1dWlkKTtcbiAgY29uc3QgYm9keSA9IEpTT04ucGFyc2UoZXZlbnQuYm9keSk7XG4gIGNvbnNvbGUubG9nKGJvZHkuZGF0YS5vYmplY3QuY3VzdG9tZXJfZW1haWwpO1xuICAvLyAgIGNvbnNvbGUubG9nKGJvZHkuY3VzdG9tZXJfZW1haWwpO1xuICBjb25zdCBlbWFpbCA9IGJvZHkuZGF0YS5vYmplY3QuY3VzdG9tZXJfZW1haWw7XG4gIC8vIGNvbnN0IGN1c3RvbWVyID0gYXdhaXQgZG9jQ2xpZW50XG4gIC8vICAgLnNjYW4oe1xuICAvLyAgICAgVGFibGVOYW1lOiB0YWJsZU5hbWUsXG4gIC8vICAgICBGaWx0ZXJFeHByZXNzaW9uOiBgZW1haWwgPSA6ZW1haWxgLFxuICAvLyAgICAgRXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlczoge1xuICAvLyAgICAgICBcIjplbWFpbFwiOiBlbWFpbCxcbiAgLy8gICAgIH0sXG4gIC8vICAgfSlcbiAgLy8gICAucHJvbWlzZSgpO1xuICAvLyBjb25zb2xlLmxvZyhjdXN0b21lcik7XG4gIGNvbnN0IHVzZXI6IGFueSA9IGRvY0NsaWVudC5xdWVyeSh7XG4gICAgVGFibGVOYW1lOiB0YWJsZU5hbWUsXG4gICAgS2V5Q29uZGl0aW9uRXhwcmVzc2lvbjogXCJVc2VySW52ZW50b3J5SW5kZXhQSyA9IFVTRVJcIixcbiAgICBGaWx0ZXJFeHByZXNzaW9uOiBcImVtYWlsID0gOmVtYWlsXCIsXG4gICAgRXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlczoge1xuICAgICAgXCI6ZW1haWxcIjogZW1haWwsXG4gICAgfSxcbiAgfSk7XG4gIGNvbnNvbGUubG9nKFwidXNlcjo6OiAgXCIsIHVzZXIpO1xuXG4gIGNvbnN0IHBheW1lbnRTdGF0dXM6IGFueSA9IGRvY0NsaWVudC51cGRhdGUoe1xuICAgIFRhYmxlTmFtZTogdGFibGVOYW1lLFxuICAgIEtleToge1xuICAgICAgcGs6IHVzZXI/Lkl0ZW1zWzBdLnBrLFxuICAgIH0sXG4gICAgQ29uZGl0aW9uRXhwcmVzc2lvbjogXCJQSyA9IDplbWFpbFwiLFxuICAgIFVwZGF0ZUV4cHJlc3Npb246IFwic2V0IG9yZGVyU3RhdHVzID0gOm9yZGVyU3RhdHVzXCIsXG4gICAgRXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlczoge1xuICAgICAgXCI6b3JkZXJTdGF0dXNcIjogXCJQQVlFRFwiLFxuICAgICAgXCI6dXNlclBLXCI6IHVzZXIuSXRlbXNbMF0uUEssXG4gICAgfSxcbiAgfSk7XG4gIHJldHVybiBwYXltZW50U3RhdHVzO1xufTtcbiJdfQ==