import { DynamoDBStreamEvent, Context } from "aws-lambda";
import * as AWS from "aws-sdk";
import { logger, metrics, tracer } from "./common/powertools";
import { v4 as uuidv4 } from "uuid";
import type { Subsegment } from "aws-xray-sdk-core";

const sqs = new AWS.SQS();

const tableName = process.env.TABLE_NAME as string;
export async function main(
  event: any,
  context: Context
): Promise<DynamoDBStreamEvent> {
  logger.info("Lambda invocation event", { event });

  // Metrics: Capture cold start metrics
  metrics.captureColdStartMetric();

  // Tracer: Get facade segment created by AWS Lambda
  const segment = tracer.getSegment();

  // Tracer: Create subsegment for the function & set it as active
  let handlerSegment: Subsegment | undefined;
  if (segment) {
    handlerSegment = segment.addNewSubsegment(`## ${process.env._HANDLER}`);
    tracer.setSegment(handlerSegment);
  }
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

  const uuid = uuidv4();

  // Logger: Append uuid to each log statement
  logger.appendKeys({ uuid });

  // Tracer: Add uuid as annotation
  tracer.putAnnotation("uuid", uuid);

  // Metrics: Add uuid as metadata
  metrics.addMetadata("uuid", uuid);
  const eventIndex = event.Records.length - 1;
  if (
    event.Records[eventIndex].eventName === "MODIFY" &&
    event.Records[eventIndex].dynamodb?.NewImage?.sk.S?.slice(0, 6) === "ORDER#"
  ) {
    const orderItems =
      event.Records[eventIndex].dynamodb?.NewImage?.orderItems?.L;
    const userId = event.Records[eventIndex].dynamodb?.NewImage?.id.S;
    logger.info("Order Items: ", { orderItems });
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
                logger.info("Error: ", { err });
              }
              logger.info("message sent: ", { data });
            }
          )
          .promise();
      }
    } catch (err) {
      logger.info("Error: ", { err });
    } finally {
      if (segment && handlerSegment) {
        // Tracer: Close subsegment (the AWS Lambda one is closed automatically)
        handlerSegment.close(); // (## index.handler)
        // Tracer: Set the facade segment as active again (the one created by AWS Lambda)
        tracer.setSegment(segment);
      }
    }
  }
  return event;
}
