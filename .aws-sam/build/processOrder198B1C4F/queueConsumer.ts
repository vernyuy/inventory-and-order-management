import { SQSEvent } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const ddbClient = new DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME as string;
export async function main(event: SQSEvent): Promise<SQSEvent> {
  const records = event.Records;
  const order = JSON.parse(records[0].body);
  const userId = order.PK.S;

  for (const item of order.orderItems.L) {
    console.log(item);
    const element = item.M.sk;
    const params = {
      TableName: tableName,
      Key: {
        PK: `${userId}`,
        SK: `${element.S}`,
      },
      UpdateExpression: "set cartProductStatus = :status, UpdateOn = :Updated",
      ExpressionAttributeValues: {
        ":status": "ORDERED",
        ":Updated": Date.now().toString(),
      },
      ReturnValues: "UPDATED_NEW",
    };
    try {
      const res = await ddbClient.update(params).promise();
      console.log("Response", { res });
    } catch (err: unknown) {
      // logger.info("Error: ", { err });
    }
  }
  return event;
}
