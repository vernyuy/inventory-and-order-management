import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import {
  DynamoEventSource,
  SqsEventSource,
} from "aws-cdk-lib/aws-lambda-event-sources";
import { Construct } from "constructs";
import * as Dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as SQS from "aws-cdk-lib/aws-sqs";
import { SqsDestination } from "aws-cdk-lib/aws-lambda-destinations";
import { Tracing } from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";
import path = require("path");

interface LambdaFnsStackProps extends cdk.StackProps {
  ddbTable: Dynamodb.Table;
  queue: SQS.Queue;
}
export class LambdaFnsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: LambdaFnsStackProps) {
    super(scope, id, props);

    const powertoolsLayer = lambda.LayerVersion.fromLayerVersionArn(
      this,
      "PowertoolsLayer",
      `arn:aws:lambda:${
        cdk.Stack.of(this).region
      }:094274105915:layer:AWSLambdaPowertoolsTypeScript:18`
    );

    const queueConsumer = new lambda.Function(this, "consumerFunction", {
      handler: "queueConsumer.main",
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset(path.join(__dirname, "lambda-fns")),
      environment: {
        TABLE_NAME: props.ddbTable.tableName,
        QUEUE_NAME: props.queue.queueName,
        QUEUE_URL: props.queue.queueUrl,
      },
      tracing: Tracing.ACTIVE,
    });

    const process_order = new lambda.Function(this, "processOrder", {
      handler: "processOrder.main",
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset(path.join(__dirname, "lambda-fns")),
      environment: {
        TABLE_NAME: props.ddbTable.tableName,
        QUEUE_NAME: props.queue.queueName,
        QUEUE_URL: props.queue.queueUrl,
      },
      layers: [powertoolsLayer],
    });
    process_order.addEventSource(
      new DynamoEventSource(props.ddbTable, {
        startingPosition: lambda.StartingPosition.LATEST,
      })
    );

    props.ddbTable.grantStreamRead(process_order);
    props.ddbTable.grantReadWriteData(process_order);

    const streamConsumer = new lambda.Function(this, "streamConsumer", {
      handler: "streamConsumer.main",
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset(path.join(__dirname, "lambda-fns")),
      environment: {
        TABLE_NAME: props.ddbTable.tableName,
        QUEUE_NAME: props.queue.queueName,
        QUEUE_URL: props.queue.queueUrl,
      },
      layers: [powertoolsLayer],
      onSuccess: new SqsDestination(props.queue),
    });

    streamConsumer.addEventSource(
      new DynamoEventSource(props.ddbTable, {
        startingPosition: lambda.StartingPosition.LATEST,
      })
    );

    queueConsumer.addEventSource(new SqsEventSource(props.queue));

    props.queue.grantConsumeMessages(queueConsumer);
    props.ddbTable.grantReadWriteData(queueConsumer);
    props.ddbTable.grantStreamRead(streamConsumer);
    props.ddbTable.grantReadWriteData(streamConsumer);
    props.queue.grantSendMessages(streamConsumer);

    const streamConsumerRole = new iam.Role(this, "streamConsumerRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    });

    streamConsumerRole.addToPolicy(
      new iam.PolicyStatement({
        actions: [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ],
        resources: [
          "arn:aws:logs:" +
            this.region +
            ":" +
            this.account +
            ":log-group:/aws/lambda/streamConsumer:*",
        ],
      })
    );
  }
}
