import { SQSEvent, Context } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { logger, metrics, tracer } from "./common/powertools";
import { v4 as uuidv4 } from "uuid";
import type { Subsegment } from "aws-xray-sdk-core";

const ddbClient = new DynamoDB.DocumentClient();
export async function main(
  event: SQSEvent,
  context: Context
): Promise<SQSEvent> {
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
  const records = event.Records;
  const params = JSON.parse(records[0].body);

  logger.info("Queue meesage", { params });

  try {
    const res = await ddbClient.update(params).promise();

    logger.info("Response", { res });
  } catch (err: unknown) {
    logger.info("Error: ", { err });
  } finally {
    if (segment && handlerSegment) {
      // Tracer: Close subsegment (the AWS Lambda one is closed automatically)
      handlerSegment.close(); // (## index.handler)
      // Tracer: Set the facade segment as active again (the one created by AWS Lambda)
      tracer.setSegment(segment);
    }
  }
  return event;
}
