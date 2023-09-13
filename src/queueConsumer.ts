import { SQSEvent } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const ddbClient = new DynamoDB.DocumentClient();
export async function main(event: SQSEvent): Promise<SQSEvent> {
  console.log("SQS::: ", event);
  const records = event.Records;
  const params = JSON.parse(records[0].body);
  console.log(params);
  try {
    const res = await ddbClient.update(params).promise();
    console.log(res);
  } catch (err: unknown) {
    console.log(err);
  }
  return event;
}
