/* eslint-disable @typescript-eslint/no-explicit-any */
import { APIGatewayProxyResult, Context } from "aws-lambda";
import * as AWS from "aws-sdk";
import type { Subsegment } from "aws-xray-sdk-core";
import { Logger } from "@aws-lambda-powertools/logger";
import { Metrics } from "@aws-lambda-powertools/metrics";
import { Tracer } from "@aws-lambda-powertools/tracer";
import { PT_VERSION } from "@aws-lambda-powertools/commons/lib/version";
import { v4 as uuidv4 } from "uuid";

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME as string;

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

module.exports.lambdaHandler = async (
  event: any,
  context: Context
): Promise<APIGatewayProxyResult> => {
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
  const body = JSON.parse(event.body);
  console.log(body.data.object.customer_email);
  //   console.log(body.customer_email);
  const email = body.data.object.customer_email;
  // const customer = await docClient
  //   .scan({
  //     TableName: tableName,
  //     FilterExpression: `email = :email`,
  //     ExpressionAttributeValues: {
  //       ":email": email,
  //     },
  //   })
  //   .promise();
  // console.log(customer);
  const user: any = docClient.query({
    TableName: tableName,
    KeyConditionExpression: "UserInventoryIndexPK = USER",
    FilterExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email,
    },
  });
  console.log("user:::  ", user);

  const paymentStatus: any = docClient.update({
    TableName: tableName,
    Key: {
      pk: user?.Items[0].pk,
    },
    ConditionExpression: "PK = :email",
    UpdateExpression: "set orderStatus = :orderStatus",
    ExpressionAttributeValues: {
      ":orderStatus": "PAYED",
      ":userPK": user.Items[0].PK,
    },
  });
  return paymentStatus;
};
