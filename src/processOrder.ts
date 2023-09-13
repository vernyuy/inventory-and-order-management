import {
  // APIGatewayProxyEvent,
  // APIGatewayProxyResult,
  DynamoDBStreamEvent,
} from "aws-lambda";
import * as AWS from "aws-sdk";
// import { v4 as uuidv4 } from "uuid";

// const region = process.env.Region;

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
    console.log("AM in");
    const id = event.Records[0].dynamodb?.NewImage?.id.S;
    const userId = id;
    const orderId = event.Records[0].dynamodb?.NewImage?.sk.S;
    // let response: APIGatewayProxyResult;
    console.log(userId, orderId);

    const cartItems = await docClient
      .query({
        TableName: tableName,
        KeyConditionExpression: "id = :id AND begins_with(sk, :sk)",
        FilterExpression: "cartProductStatus = :status",
        ProjectionExpression: "sk, quantity, unit_price",
        ExpressionAttributeValues: {
          ":id": id,
          ":sk": "ITEM#",
          ":status": "PENDING",
        },
      })
      .promise();
    console.log("ITEMS:::::   ", cartItems);
    let total_price = 0;
    cartItems.Items?.forEach((item) => {
      total_price += parseFloat(item.unit_price) * parseInt(item.quantity);
    });
    try {
      const result = await docClient
        .update({
          TableName: tableName,
          Key: {
            id: id,
            sk: orderId,
          },
          UpdateExpression:
            "set orderItems = :orderItems, orderStatus = :status, total_items = :total_items, total_price = :total_price, UpdatedOn = :update",
          ExpressionAttributeValues: {
            ":orderItems": cartItems.Items,
            ":status": "ORDERED",
            ":total_items": cartItems.Items?.length,
            ":total_price": total_price,
            ":update": Date.now().toString(),
          },
        })
        .promise();

      console.log(result);
    } catch (err) {
      console.log(err);
    }
  }

  return event;
}
