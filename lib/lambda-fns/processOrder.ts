import { DynamoDBStreamEvent, Context } from "aws-lambda";
import * as AWS from "aws-sdk";
import { logger, metrics, tracer } from "./utils";
// import type { Subsegment } from "aws-xray-sdk-core";
const sqs = new AWS.SQS();


const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME as string;

export async function main(
  event: DynamoDBStreamEvent,
  context: Context
): Promise<DynamoDBStreamEvent> {
  // Logger: Log the incoming event
  logger.info("Lambda invocation event", { event });

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

  if (
    event.Records[0].eventName === "INSERT" &&
    event.Records[0].dynamodb?.NewImage?.SK.S?.slice(0, 6) === "ORDER#"
  ) {
    logger.info(`Response ${event.Records[0].eventName}`, {
      statusCode: 200,
      body: event.Records,
    });

    const id = event.Records[0].dynamodb?.NewImage?.PK.S;
    const orderId = event.Records[0].dynamodb?.NewImage?.SK.S;
    logger.info(`Order Id`, {
      orderId,
      id,
    });
    const cartItems = await docClient
      .query({
        TableName: tableName,
        KeyConditionExpression: "PK = :id AND begins_with(SK, :sk)",
        FilterExpression: "cartProductStatus = :status",
        ProjectionExpression: "SK, quantity, unit_price",
        ExpressionAttributeValues: {
          ":id": id,
          ":sk": "ITEM#",
          ":status": "PENDING",
        },
      })
      .promise();

    logger.info(`Cart Items`, {
      statusCode: 200,
      body: cartItems,
    });

    let total_price = 0;
    cartItems.Items?.forEach((item) => {
      total_price += parseFloat(item.unit_price) * parseInt(item.quantity);
    });
    try {
      const result = await docClient
        .update({
          TableName: tableName,
          Key: {
            PK: id,
            SK: orderId,
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

      logger.info(`Process Order Result`, {
        statusCode: 200,
        body: result,
      });
    } catch (err) {
      tracer.addErrorAsMetadata(err as Error);
      logger.info(`Error`, {
        statusCode: 500,
        error: err,
      });
    }
  }

  const eventIndex = event.Records.length - 1;
  if (
    event.Records[0].eventName === "MODIFY" &&
    event.Records[0].dynamodb?.NewImage?.SK.S?.slice(0, 6) === "ORDER#"
  ) {
    const orderItems =
      event.Records[eventIndex].dynamodb?.NewImage?.orderItems?.L;
    // const userId = event.Records[eventIndex].dynamodb?.NewImage?.id.S;
    logger.info("Order Items: ", { orderItems });
    const test = await sqs
      .sendMessage({
        QueueUrl: process.env.QUEUE_URL as string,
        MessageBody: JSON.stringify(event.Records[0].dynamodb.NewImage),
      })
      .promise();

    logger.info("Lambda invocation event", { test });
    return event;
  }

  return event;
}
