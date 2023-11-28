/* eslint-disable @typescript-eslint/no-explicit-any */

import { DynamoDBStreamEvent, Context } from "aws-lambda";
import * as AWS from "aws-sdk";
import { Logger } from "@aws-lambda-powertools/logger";
import { Metrics } from "@aws-lambda-powertools/metrics";
import { Tracer } from "@aws-lambda-powertools/tracer";
import { PT_VERSION } from "@aws-lambda-powertools/commons/lib/version";
import Stripe from "stripe";

const sqs = new AWS.SQS();
const stripe = new Stripe(
  "sk_test_51NVJ4RECpTjJRRCodmsyMIK613vbK0ElhyUwMReszzx6qs8FzZQDdi8VtZ5DjYkn5gNQryjTDMNkf01QLKVwxwTP00DT8HavNL",
  {
    typescript: true,
    apiVersion: "2023-08-16",
  }
);

const defaultValues = {
  region: process.env.AWS_REGION || "N/A",
  executionEnv: process.env.AWS_EXECUTION_ENV || "N/A",
};

const logger = new Logger({
  persistentLogAttributes: {
    ...defaultValues,
    logger: {
      name: "@aws-lambda-powertools/logger",
      version: PT_VERSION,
    },
  },
});

const metrics = new Metrics({
  defaultDimensions: defaultValues,
});

const tracer = new Tracer();

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
    event.Records[0].dynamodb?.NewImage?.SK.S?.slice(0, 6) === "ORDER#"
  ) {
    const orderItems =
      event.Records[eventIndex].dynamodb?.NewImage?.orderItems?.L;
    let items = [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: 100,
          product_data: {
            name: "Test product",
            description: "test products description",
            images: [
              "https://cdn.rebrickable.com/media/thumbs/sets/5006530-1/79749.jpg/1000x800p.jpg",
            ],
          },
        },
      },
    ];

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
