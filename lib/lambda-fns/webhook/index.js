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
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;
module.exports.lambdaHandler = async (event) => {
    console.log("Lambda invocation event", { event });
    const body = JSON.parse(event.body);
    console.log(body.data.object.receipt_email);
    const email = body.data.object.receipt_email;
    const user = docClient.query({
        TableName: tableName,
        KeyConditionExpression: `UserItemIndexPK = USER`,
        FilterExpression: "email = :email",
        ProjectionExpression: "PK, SK",
        ExpressionAttributeValues: {
            ":email": email,
        },
    });
    console.log("user:::  ", user);
    const paymentStatus = docClient.update({
        TableName: process.env.TABLE_NAME,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsNkNBQStCO0FBRS9CLE1BQU0sU0FBUyxHQUFHLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNwRCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQW9CLENBQUM7QUFFbkQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEdBQUcsS0FBSyxFQUNsQyxLQUFVLEVBQ3NCLEVBQUU7SUFDbEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDbEQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUM1QyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUM7SUFDN0MsTUFBTSxJQUFJLEdBQVEsU0FBUyxDQUFDLEtBQUssQ0FBQztRQUNoQyxTQUFTLEVBQUUsU0FBUztRQUNwQixzQkFBc0IsRUFBRSx3QkFBd0I7UUFDaEQsZ0JBQWdCLEVBQUUsZ0JBQWdCO1FBQ2xDLG9CQUFvQixFQUFFLFFBQVE7UUFDOUIseUJBQXlCLEVBQUU7WUFDekIsUUFBUSxFQUFFLEtBQUs7U0FDaEI7S0FDRixDQUFDLENBQUM7SUFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUUvQixNQUFNLGFBQWEsR0FBUSxTQUFTLENBQUMsTUFBTSxDQUFDO1FBQzFDLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQW9CO1FBQzNDLEdBQUcsRUFBRTtZQUNILEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7U0FDdEI7UUFDRCxtQkFBbUIsRUFBRSxhQUFhO1FBQ2xDLGdCQUFnQixFQUFFLGdDQUFnQztRQUNsRCx5QkFBeUIsRUFBRTtZQUN6QixjQUFjLEVBQUUsT0FBTztZQUN2QixTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1NBQzVCO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxhQUFhLENBQUM7QUFDdkIsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueSAqL1xuaW1wb3J0IHsgQVBJR2F0ZXdheVByb3h5UmVzdWx0LCBDb250ZXh0IH0gZnJvbSBcImF3cy1sYW1iZGFcIjtcbmltcG9ydCAqIGFzIEFXUyBmcm9tIFwiYXdzLXNka1wiO1xuXG5jb25zdCBkb2NDbGllbnQgPSBuZXcgQVdTLkR5bmFtb0RCLkRvY3VtZW50Q2xpZW50KCk7XG5jb25zdCB0YWJsZU5hbWUgPSBwcm9jZXNzLmVudi5UQUJMRV9OQU1FIGFzIHN0cmluZztcblxubW9kdWxlLmV4cG9ydHMubGFtYmRhSGFuZGxlciA9IGFzeW5jIChcbiAgZXZlbnQ6IGFueVxuKTogUHJvbWlzZTxBUElHYXRld2F5UHJveHlSZXN1bHQ+ID0+IHtcbiAgY29uc29sZS5sb2coXCJMYW1iZGEgaW52b2NhdGlvbiBldmVudFwiLCB7IGV2ZW50IH0pO1xuICBjb25zdCBib2R5ID0gSlNPTi5wYXJzZShldmVudC5ib2R5KTtcbiAgY29uc29sZS5sb2coYm9keS5kYXRhLm9iamVjdC5yZWNlaXB0X2VtYWlsKTtcbiAgY29uc3QgZW1haWwgPSBib2R5LmRhdGEub2JqZWN0LnJlY2VpcHRfZW1haWw7XG4gIGNvbnN0IHVzZXI6IGFueSA9IGRvY0NsaWVudC5xdWVyeSh7XG4gICAgVGFibGVOYW1lOiB0YWJsZU5hbWUsXG4gICAgS2V5Q29uZGl0aW9uRXhwcmVzc2lvbjogYFVzZXJJdGVtSW5kZXhQSyA9IFVTRVJgLFxuICAgIEZpbHRlckV4cHJlc3Npb246IFwiZW1haWwgPSA6ZW1haWxcIixcbiAgICBQcm9qZWN0aW9uRXhwcmVzc2lvbjogXCJQSywgU0tcIixcbiAgICBFeHByZXNzaW9uQXR0cmlidXRlVmFsdWVzOiB7XG4gICAgICBcIjplbWFpbFwiOiBlbWFpbCxcbiAgICB9LFxuICB9KTtcbiAgY29uc29sZS5sb2coXCJ1c2VyOjo6ICBcIiwgdXNlcik7XG5cbiAgY29uc3QgcGF5bWVudFN0YXR1czogYW55ID0gZG9jQ2xpZW50LnVwZGF0ZSh7XG4gICAgVGFibGVOYW1lOiBwcm9jZXNzLmVudi5UQUJMRV9OQU1FIGFzIHN0cmluZyxcbiAgICBLZXk6IHtcbiAgICAgIHBrOiB1c2VyPy5JdGVtc1swXS5wayxcbiAgICB9LFxuICAgIENvbmRpdGlvbkV4cHJlc3Npb246IFwiUEsgPSA6ZW1haWxcIixcbiAgICBVcGRhdGVFeHByZXNzaW9uOiBcInNldCBvcmRlclN0YXR1cyA9IDpvcmRlclN0YXR1c1wiLFxuICAgIEV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXM6IHtcbiAgICAgIFwiOm9yZGVyU3RhdHVzXCI6IFwiUEFZRURcIixcbiAgICAgIFwiOnVzZXJQS1wiOiB1c2VyLkl0ZW1zWzBdLlBLLFxuICAgIH0sXG4gIH0pO1xuICByZXR1cm4gcGF5bWVudFN0YXR1cztcbn07XG4iXX0=