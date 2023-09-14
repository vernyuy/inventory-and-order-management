import { DynamoDBStreamEvent } from "aws-lambda";
import * as AWS from "aws-sdk";

const sqs = new AWS.SQS();

const tableName = process.env.TABLE_NAME as string;
export async function main(event: any): Promise<DynamoDBStreamEvent> {
  console.log(event);
  const e = event.Records.length - 1;
  if (
    event.Records[e].eventName === "MODIFY" &&
    event.Records[e].dynamodb?.NewImage?.sk.S?.slice(0, 6) === "ORDER#"
  ) {
    console.log("Ready to enter the Queue");
    const orderItems = event.Records[e].dynamodb?.NewImage?.orderItems?.L;
    const userId = event.Records[e].dynamodb?.NewImage?.id.S;
    console.log(orderItems);
    try {
      for (let index = 0; index < orderItems.length; index++) {
        const element = orderItems[index]?.M?.sk;
        console.log(element);
        const params = {
          TableName: tableName,
          Key: {
            id: `${userId}`,
            sk: `${element?.S}`,
          },
          UpdateExpression:
            "set cartProductStatus = :status, UpdateOn = :Updated",
          ExpressionAttributeValues: {
            ":status": "ORDERED",
            ":Updated": Date.now().toString(),
          },
          ReturnValues: "UPDATED_NEW",
        };
        console.log(params);
        console.log(process.env.QUEUE_URL);
        await sqs
          .sendMessage(
            {
              QueueUrl: process.env.QUEUE_URL as string,
              MessageBody: JSON.stringify(params),
              MessageGroupId: userId,
              MessageDeduplicationId: element.S,
            },
            function (err, data) {
              if (err) {
                console.log("Error:::: ", err);
              }
              console.log(data);
            }
          )
          .promise();
      }
    } catch (err) {
      console.log(err);
    }
  }
  return event;
}
