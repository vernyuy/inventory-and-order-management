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

// import {CdkImsProjectStack} from '../cdk-ims-project-stack';

interface LambdaStackProps extends cdk.StackProps {
  ddbTable: Dynamodb.Table;
  queue: SQS.Queue;
}
export class LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const powertoolsLayer = lambda.LayerVersion.fromLayerVersionArn(
      this,
      "PowertoolsLayer",
      `arn:aws:lambda:${
        cdk.Stack.of(this).region
      }:094274105915:layer:AWSLambdaPowertoolsTypeScript:18`
    );
    const dlq = new SQS.Queue(this, "dlq");

    const queueConsumer = new lambda.Function(this, "consumerFunction", {
      handler: "queueConsumer.main",
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("src"),
      environment: {
        TABLE_NAME: props.ddbTable.tableName,
        QUEUE_NAME: props.queue.queueName,
        QUEUE_URL: props.queue.queueUrl,
        // test: props.targetLambda.functionName
      },
      layers: [powertoolsLayer],
      onFailure: new SqsDestination(dlq),
    });

    const process_order = new lambda.Function(this, "processOrder", {
      handler: "processOrder.main",
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("src"),
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
      code: lambda.Code.fromAsset("src"),
      environment: {
        TABLE_NAME: props.ddbTable.tableName,
        QUEUE_NAME: props.queue.queueName,
        QUEUE_URL: props.queue.queueUrl,
      },
      layers: [powertoolsLayer],
      role: queueConsumer.role,
    });

    streamConsumer.addEventSource(
      new DynamoEventSource(props.ddbTable, {
        startingPosition: lambda.StartingPosition.LATEST,
      })
    );

    queueConsumer.addEventSource(new SqsEventSource(props.queue));

    props.queue.grantConsumeMessages(queueConsumer);
    props.queue.grantSendMessages(streamConsumer);
    props.ddbTable.grantReadWriteData(queueConsumer);
    props.ddbTable.grantStreamRead(streamConsumer);
    props.ddbTable.grantReadWriteData(streamConsumer);
  }
}
