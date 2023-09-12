import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  DynamoDBStreamEvent,
} from "aws-lambda";
import * as AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const region = process.env.Region;

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME as string;

export async function main(
  event: DynamoDBStreamEvent
): Promise<DynamoDBStreamEvent> {
  console.log(event);
  console.log(
    "Event: ",
    event.Records[0].dynamodb?.NewImage?.sk.S?.slice(0, 5)
  );
  if (
    event.Records[0].eventName === "INSERT" &&
    event.Records[0].dynamodb?.NewImage?.sk.S?.slice(0, 6) === "ORDER#"
  ) {
    const id = event.Records[0].dynamodb?.NewImage?.id.S;
    const orderId = event.Records[0].dynamodb?.NewImage?.sk.S;
    let response: APIGatewayProxyResult;

    const cartItems = await docClient
      .query({
        TableName: tableName,
        KeyConditionExpression: "id = :id AND begins_with(sk, :sk)",
        FilterExpression: "cartProductStatus = :status",
        // ProjectionExpression: "id, sk, quantity, unit_price",
        ExpressionAttributeValues: {
          ":id": id,
          ":sk": "ITEM#",
          ":status": "PENDING",
        },
      })
      .promise();
    console.log("ITEMS:::::   ", cartItems.Items);
    let total_price = 0;
    cartItems.Items?.map((item) => {
      const price = parseFloat(item.unit_price);
      const qty = parseInt(item.quantity);
      const tot = price * qty;
      total_price = total_price + tot;
      console.log("Quantity::   ", item.quantity);
    });
    console.log(total_price);
    try {
      const result = await docClient
        .update({
          TableName: tableName,
          Key: {
            id: id,
            sk: orderId,
          },
          UpdateExpression:
            "set orderItems = :orderItems orderStatus = :status ",
          // ReturnValues: 'UPDATED_NEW',
          ExpressionAttributeValues: {
            ":orderItems": cartItems.Items,
            ":status": "ORDERED",
            // ":total_items": cartItems.Items?.length,
            // ":total_price": total_price,
          },
        })
        .promise();

      console.log(result);
    } catch (err) {
      response = {
        statusCode: 500,
        body: JSON.stringify({
          error: err,
        }),
      };
    }
    response = {
      statusCode: 200,
      body: JSON.stringify({
        message: "Checked out successfully",
      }),
    };
  }

  return event;
}
