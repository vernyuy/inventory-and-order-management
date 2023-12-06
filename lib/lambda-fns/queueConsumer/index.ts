import { SQSEvent, SQSRecord, Context, SQSBatchResponse } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { logger, metrics, tracer } from "../utils";
import {
  BatchProcessor,
  EventType,
  processPartialResponse,
} from "@aws-lambda-powertools/batch";

const ddbClient = new DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME as string;
const processor = new BatchProcessor(EventType.SQS);

const recordHandler = async (record: SQSRecord): Promise<void> => {
  const payload = record.body;
  if (payload) {
    const order = JSON.parse(payload);

    console.log("Processed item", { order });
    const userId = order.PK.S;
    for (const item of order.orderItems.L) {
      console.log(item);
      const element = item.M.SK;
      const params = {
        TableName: tableName,
        Key: {
          PK: `${userId}`,
          SK: `${element.S}`,
        },
        UpdateExpression:
          "set cartProductStatus = :status, UpdateOn = :Updated",
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
  }
};

export const main = async (
  event: SQSEvent,
  context: Context
): Promise<SQSBatchResponse> => {
  return processPartialResponse(event, recordHandler, processor, {
    context,
  });
};