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
    // const params = {
    //     TableName: tableName,
    //     "Item": {
    //         "pk": `USER#${body.userId}`,
    //         "sk": `PRODUCT#${body.productId}`,
    //         "productId": body.productId,
    //         "userId": body.userId,
    //         "quantity": body.quantity,
    //         "addedDate": Date.now().toString(),
    //         "cartProdcutStatus": "PENDING",
    //         }
    //     }
    // try{
    //     const res = await docClient.put(params).promise()
    //     response = {
    //         statusCode: 200,
    //         body: JSON.stringify({
    //             message: 'successfully added product to cart'
    //         })
    //     }
    // }catch(err: any){
    //     response = {
    //         statusCode: 500,
    //         body: JSON.stringify({
    //             message: 'Failed to add to cart'
    //         })
    //     }
    // }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViaG9vay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIndlYmhvb2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLDZDQUErQjtBQUMvQixvQ0FBbUQ7QUFFbkQsK0JBQW9DO0FBRXBDLE1BQU0sU0FBUyxHQUFHLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNwRCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQW9CLENBQUM7QUFFbkQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEdBQUcsS0FBSyxFQUNsQyxLQUFVLEVBQ1YsT0FBZ0IsRUFDZ0IsRUFBRTtJQUNsQyxjQUFNLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUVsRCxzQ0FBc0M7SUFDdEMsZUFBTyxDQUFDLHNCQUFzQixFQUFFLENBQUM7SUFFakMsbURBQW1EO0lBQ25ELE1BQU0sT0FBTyxHQUFHLGNBQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUVwQyxnRUFBZ0U7SUFDaEUsSUFBSSxjQUFzQyxDQUFDO0lBQzNDLElBQUksT0FBTyxFQUFFO1FBQ1gsY0FBYyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUN4RSxjQUFNLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0tBQ25DO0lBQ0Qsb0VBQW9FO0lBQ3BFLGNBQU0sQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzNCLGNBQU0sQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO0lBRWxDLHlDQUF5QztJQUN6QyxjQUFNLENBQUMsYUFBYSxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7SUFFM0Qsc0NBQXNDO0lBQ3RDLGVBQU8sQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO0lBRWpDLG9EQUFvRDtJQUNwRCxjQUFNLENBQUMsVUFBVSxDQUFDO1FBQ2hCLFlBQVksRUFBRSxPQUFPLENBQUMsWUFBWTtLQUNuQyxDQUFDLENBQUM7SUFFSCxNQUFNLElBQUksR0FBRyxJQUFBLFNBQU0sR0FBRSxDQUFDO0lBRXRCLDRDQUE0QztJQUM1QyxjQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUU1QixpQ0FBaUM7SUFDakMsY0FBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFFbkMsZ0NBQWdDO0lBQ2hDLGVBQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2xDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDN0Msc0NBQXNDO0lBQ3RDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQztJQUM5QyxNQUFNLFFBQVEsR0FBRyxNQUFNLFNBQVM7U0FDN0IsSUFBSSxDQUFDO1FBQ0osU0FBUyxFQUFFLFNBQVM7UUFDcEIsZ0JBQWdCLEVBQUUsZ0JBQWdCO1FBQ2xDLHlCQUF5QixFQUFFO1lBQ3pCLFFBQVEsRUFBRSxLQUFLO1NBQ2hCO0tBQ0YsQ0FBQztTQUNELE9BQU8sRUFBRSxDQUFDO0lBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN0QixtQkFBbUI7SUFDbkIsNEJBQTRCO0lBQzVCLGdCQUFnQjtJQUNoQix1Q0FBdUM7SUFDdkMsNkNBQTZDO0lBQzdDLHVDQUF1QztJQUN2QyxpQ0FBaUM7SUFDakMscUNBQXFDO0lBQ3JDLDhDQUE4QztJQUM5QywwQ0FBMEM7SUFDMUMsWUFBWTtJQUNaLFFBQVE7SUFDUixPQUFPO0lBQ1Asd0RBQXdEO0lBRXhELG1CQUFtQjtJQUNuQiwyQkFBMkI7SUFDM0IsaUNBQWlDO0lBQ2pDLDREQUE0RDtJQUM1RCxhQUFhO0lBQ2IsUUFBUTtJQUVSLG9CQUFvQjtJQUNwQixtQkFBbUI7SUFDbkIsMkJBQTJCO0lBQzNCLGlDQUFpQztJQUNqQywrQ0FBK0M7SUFDL0MsYUFBYTtJQUNiLFFBQVE7SUFDUixJQUFJO0lBQ0osTUFBTSxJQUFJLEdBQUcsTUFBTSxTQUFTLENBQUMsS0FBSyxDQUFDO1FBQ2pDLFNBQVMsRUFBRSxTQUFTO1FBQ3BCLHNCQUFzQixFQUFFLGVBQWU7UUFDdkMsZ0JBQWdCLEVBQUUsZ0JBQWdCO1FBQ2xDLHlCQUF5QixFQUFFO1lBQ3pCLFFBQVEsRUFBRSxLQUFLO1NBQ2hCO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFFL0Isb0JBQW9CO0lBQ3BCLE1BQU07SUFDTiw0QkFBNEI7SUFDNUIsYUFBYTtJQUNiLDhCQUE4QjtJQUM5QixTQUFTO0lBQ1QsOENBQThDO0lBQzlDLHNFQUFzRTtJQUN0RSxtQ0FBbUM7SUFDbkMseUNBQXlDO0lBQ3pDLFNBQVM7SUFDVCxNQUFNO0lBQ04sa0JBQWtCO0lBQ2xCLHdCQUF3QjtJQUN4QixLQUFLO0lBQ0wsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBUElHYXRld2F5UHJveHlSZXN1bHQsIENvbnRleHQgfSBmcm9tIFwiYXdzLWxhbWJkYVwiO1xuaW1wb3J0ICogYXMgQVdTIGZyb20gXCJhd3Mtc2RrXCI7XG5pbXBvcnQgeyBsb2dnZXIsIG1ldHJpY3MsIHRyYWNlciB9IGZyb20gXCIuLi91dGlsc1wiO1xuaW1wb3J0IHR5cGUgeyBTdWJzZWdtZW50IH0gZnJvbSBcImF3cy14cmF5LXNkay1jb3JlXCI7XG5pbXBvcnQgeyB2NCBhcyB1dWlkdjQgfSBmcm9tIFwidXVpZFwiO1xuXG5jb25zdCBkb2NDbGllbnQgPSBuZXcgQVdTLkR5bmFtb0RCLkRvY3VtZW50Q2xpZW50KCk7XG5jb25zdCB0YWJsZU5hbWUgPSBwcm9jZXNzLmVudi5UQUJMRV9OQU1FIGFzIHN0cmluZztcblxubW9kdWxlLmV4cG9ydHMubGFtYmRhSGFuZGxlciA9IGFzeW5jIChcbiAgZXZlbnQ6IGFueSxcbiAgY29udGV4dDogQ29udGV4dFxuKTogUHJvbWlzZTxBUElHYXRld2F5UHJveHlSZXN1bHQ+ID0+IHtcbiAgbG9nZ2VyLmluZm8oXCJMYW1iZGEgaW52b2NhdGlvbiBldmVudFwiLCB7IGV2ZW50IH0pO1xuXG4gIC8vIE1ldHJpY3M6IENhcHR1cmUgY29sZCBzdGFydCBtZXRyaWNzXG4gIG1ldHJpY3MuY2FwdHVyZUNvbGRTdGFydE1ldHJpYygpO1xuXG4gIC8vIFRyYWNlcjogR2V0IGZhY2FkZSBzZWdtZW50IGNyZWF0ZWQgYnkgQVdTIExhbWJkYVxuICBjb25zdCBzZWdtZW50ID0gdHJhY2VyLmdldFNlZ21lbnQoKTtcblxuICAvLyBUcmFjZXI6IENyZWF0ZSBzdWJzZWdtZW50IGZvciB0aGUgZnVuY3Rpb24gJiBzZXQgaXQgYXMgYWN0aXZlXG4gIGxldCBoYW5kbGVyU2VnbWVudDogU3Vic2VnbWVudCB8IHVuZGVmaW5lZDtcbiAgaWYgKHNlZ21lbnQpIHtcbiAgICBoYW5kbGVyU2VnbWVudCA9IHNlZ21lbnQuYWRkTmV3U3Vic2VnbWVudChgIyMgJHtwcm9jZXNzLmVudi5fSEFORExFUn1gKTtcbiAgICB0cmFjZXIuc2V0U2VnbWVudChoYW5kbGVyU2VnbWVudCk7XG4gIH1cbiAgLy8gVHJhY2VyOiBBbm5vdGF0ZSB0aGUgc3Vic2VnbWVudCB3aXRoIHRoZSBjb2xkIHN0YXJ0ICYgc2VydmljZU5hbWVcbiAgdHJhY2VyLmFubm90YXRlQ29sZFN0YXJ0KCk7XG4gIHRyYWNlci5hZGRTZXJ2aWNlTmFtZUFubm90YXRpb24oKTtcblxuICAvLyBUcmFjZXI6IEFkZCBhd3NSZXF1ZXN0SWQgYXMgYW5ub3RhdGlvblxuICB0cmFjZXIucHV0QW5ub3RhdGlvbihcImF3c1JlcXVlc3RJZFwiLCBjb250ZXh0LmF3c1JlcXVlc3RJZCk7XG5cbiAgLy8gTWV0cmljczogQ2FwdHVyZSBjb2xkIHN0YXJ0IG1ldHJpY3NcbiAgbWV0cmljcy5jYXB0dXJlQ29sZFN0YXJ0TWV0cmljKCk7XG5cbiAgLy8gTG9nZ2VyOiBBcHBlbmQgYXdzUmVxdWVzdElkIHRvIGVhY2ggbG9nIHN0YXRlbWVudFxuICBsb2dnZXIuYXBwZW5kS2V5cyh7XG4gICAgYXdzUmVxdWVzdElkOiBjb250ZXh0LmF3c1JlcXVlc3RJZCxcbiAgfSk7XG5cbiAgY29uc3QgdXVpZCA9IHV1aWR2NCgpO1xuXG4gIC8vIExvZ2dlcjogQXBwZW5kIHV1aWQgdG8gZWFjaCBsb2cgc3RhdGVtZW50XG4gIGxvZ2dlci5hcHBlbmRLZXlzKHsgdXVpZCB9KTtcblxuICAvLyBUcmFjZXI6IEFkZCB1dWlkIGFzIGFubm90YXRpb25cbiAgdHJhY2VyLnB1dEFubm90YXRpb24oXCJ1dWlkXCIsIHV1aWQpO1xuXG4gIC8vIE1ldHJpY3M6IEFkZCB1dWlkIGFzIG1ldGFkYXRhXG4gIG1ldHJpY3MuYWRkTWV0YWRhdGEoXCJ1dWlkXCIsIHV1aWQpO1xuICBjb25zdCBib2R5ID0gSlNPTi5wYXJzZShldmVudC5ib2R5KTtcbiAgY29uc29sZS5sb2coYm9keS5kYXRhLm9iamVjdC5jdXN0b21lcl9lbWFpbCk7XG4gIC8vICAgY29uc29sZS5sb2coYm9keS5jdXN0b21lcl9lbWFpbCk7XG4gIGNvbnN0IGVtYWlsID0gYm9keS5kYXRhLm9iamVjdC5jdXN0b21lcl9lbWFpbDtcbiAgY29uc3QgY3VzdG9tZXIgPSBhd2FpdCBkb2NDbGllbnRcbiAgICAuc2Nhbih7XG4gICAgICBUYWJsZU5hbWU6IHRhYmxlTmFtZSxcbiAgICAgIEZpbHRlckV4cHJlc3Npb246IGBlbWFpbCA9IDplbWFpbGAsXG4gICAgICBFeHByZXNzaW9uQXR0cmlidXRlVmFsdWVzOiB7XG4gICAgICAgIFwiOmVtYWlsXCI6IGVtYWlsLFxuICAgICAgfSxcbiAgICB9KVxuICAgIC5wcm9taXNlKCk7XG4gIGNvbnNvbGUubG9nKGN1c3RvbWVyKTtcbiAgLy8gY29uc3QgcGFyYW1zID0ge1xuICAvLyAgICAgVGFibGVOYW1lOiB0YWJsZU5hbWUsXG4gIC8vICAgICBcIkl0ZW1cIjoge1xuICAvLyAgICAgICAgIFwicGtcIjogYFVTRVIjJHtib2R5LnVzZXJJZH1gLFxuICAvLyAgICAgICAgIFwic2tcIjogYFBST0RVQ1QjJHtib2R5LnByb2R1Y3RJZH1gLFxuICAvLyAgICAgICAgIFwicHJvZHVjdElkXCI6IGJvZHkucHJvZHVjdElkLFxuICAvLyAgICAgICAgIFwidXNlcklkXCI6IGJvZHkudXNlcklkLFxuICAvLyAgICAgICAgIFwicXVhbnRpdHlcIjogYm9keS5xdWFudGl0eSxcbiAgLy8gICAgICAgICBcImFkZGVkRGF0ZVwiOiBEYXRlLm5vdygpLnRvU3RyaW5nKCksXG4gIC8vICAgICAgICAgXCJjYXJ0UHJvZGN1dFN0YXR1c1wiOiBcIlBFTkRJTkdcIixcbiAgLy8gICAgICAgICB9XG4gIC8vICAgICB9XG4gIC8vIHRyeXtcbiAgLy8gICAgIGNvbnN0IHJlcyA9IGF3YWl0IGRvY0NsaWVudC5wdXQocGFyYW1zKS5wcm9taXNlKClcblxuICAvLyAgICAgcmVzcG9uc2UgPSB7XG4gIC8vICAgICAgICAgc3RhdHVzQ29kZTogMjAwLFxuICAvLyAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgLy8gICAgICAgICAgICAgbWVzc2FnZTogJ3N1Y2Nlc3NmdWxseSBhZGRlZCBwcm9kdWN0IHRvIGNhcnQnXG4gIC8vICAgICAgICAgfSlcbiAgLy8gICAgIH1cblxuICAvLyB9Y2F0Y2goZXJyOiBhbnkpe1xuICAvLyAgICAgcmVzcG9uc2UgPSB7XG4gIC8vICAgICAgICAgc3RhdHVzQ29kZTogNTAwLFxuICAvLyAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgLy8gICAgICAgICAgICAgbWVzc2FnZTogJ0ZhaWxlZCB0byBhZGQgdG8gY2FydCdcbiAgLy8gICAgICAgICB9KVxuICAvLyAgICAgfVxuICAvLyB9XG4gIGNvbnN0IHVzZXIgPSBhd2FpdCBkb2NDbGllbnQucXVlcnkoe1xuICAgIFRhYmxlTmFtZTogdGFibGVOYW1lLFxuICAgIEtleUNvbmRpdGlvbkV4cHJlc3Npb246IFwiR1NJMVBLID0gVVNFUlwiLFxuICAgIEZpbHRlckV4cHJlc3Npb246IFwiZW1haWwgPSA6ZW1haWxcIixcbiAgICBFeHByZXNzaW9uQXR0cmlidXRlVmFsdWVzOiB7XG4gICAgICBcIjplbWFpbFwiOiBlbWFpbCxcbiAgICB9LFxuICB9KTtcbiAgY29uc29sZS5sb2coXCJ1c2VyOjo6ICBcIiwgdXNlcik7XG5cbiAgLy8gZG9jQ2xpZW50LnVwZGF0ZShcbiAgLy8gICB7XG4gIC8vICAgICBUYWJsZU5hbWU6IHRhYmxlTmFtZSxcbiAgLy8gICAgIEtleToge1xuICAvLyAgICAgICBwazogdXNlci5JdGVtc1swXS5wayxcbiAgLy8gICAgIH0sXG4gIC8vICAgICBDb25kaXRpb25FeHByZXNzaW9uOiBcInVzZXJJZCA9IDplbWFpbFwiLFxuICAvLyAgICAgVXBkYXRlRXhwcmVzc2lvbjogXCJzZXQgY2FydFByb2R1Y3RTdGF0dXMgPSA6Y2FydFByb2R1Y3RTdGF0dXNcIixcbiAgLy8gICAgIEV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXM6IHtcbiAgLy8gICAgICAgXCI6Y2FydFByb2R1Y3RTdGF0dXNcIjogXCJQRU5ESU5HXCIsXG4gIC8vICAgICB9LFxuICAvLyAgIH1cbiAgLy8gdXNlcklkOiB1c2VySWQsXG4gIC8vIHByb2R1Y3RJZDogcHJvZHVjdElkLFxuICAvLyApO1xuICByZXR1cm4gZXZlbnQ7XG59O1xuIl19