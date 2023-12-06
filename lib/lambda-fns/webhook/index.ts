/* eslint-disable @typescript-eslint/no-explicit-any */
import { APIGatewayProxyResult, Context } from "aws-lambda";
import * as AWS from "aws-sdk";

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME as string;

module.exports.lambdaHandler = async (
  event: any
): Promise<APIGatewayProxyResult> => {
  console.log("Lambda invocation event", { event });
  const body = JSON.parse(event.body);
  console.log(body.data.object.receipt_email);
  const email = body.data.object.receipt_email;
  const user: any = docClient.query({
    TableName: tableName,
    KeyConditionExpression: `UserItemIndexPK = USER`,
    FilterExpression: "email = :email",
    ProjectionExpression: "PK, SK",
    ExpressionAttributeValues: {
      ":email": email,
    },
  });
  console.log("user:::  ", user);

  const paymentStatus: any = docClient.update({
    TableName: process.env.TABLE_NAME as string,
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
