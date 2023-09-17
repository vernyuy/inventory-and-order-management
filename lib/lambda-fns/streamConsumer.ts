import { DynamoDBStreamEvent, Context } from "aws-lambda";
import * as AWS from "aws-sdk";
import { logger, metrics, tracer } from "../utils";

const sqs = new AWS.SQS();

export async function main(
  event: any,
  context: Context
): Promise<DynamoDBStreamEvent> {
  logger.info("Lambda invocation event", { event });

  // Metrics: Capture cold start metrics
  metrics.captureColdStartMetric();

  // Tracer: Annotate the subsegment with the cold start & serviceName
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
  const eventIndex = event.Records.length - 1;
  if (
    event.Records[0].eventName === "MODIFY" &&
    event.Records[0].dynamodb?.NewImage?.sk.S?.slice(0, 6) === "ORDER#"
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
    return orderItems;
  }
  return event;
}
