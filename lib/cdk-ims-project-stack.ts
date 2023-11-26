import * as cdk from "aws-cdk-lib";
import * as appsync from "aws-cdk-lib/aws-appsync";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import * as sqs from "aws-cdk-lib/aws-sqs";
// import { LambdaFnsStack } from "./lambda-fns-stack";
import { StripeWebhookStack } from "./stripe-webhook-stack";
import { OrderAppsyncFuncStack } from "./order-appsync-func-stack";
import { InventoryAppsyncFuncStack } from "./inventory-appsync-func-stack";
// import { QueryAppsyncFuncStack } from "./query-appsync-func-stack";
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from "aws-cdk-lib/pipelines";
import * as iam from "aws-cdk-lib/aws-iam";
// import * as secret from "aws-cdk-lib/aws-secretsmanager"

export class CdkImsProjectStack extends cdk.Stack {
  public orders_table: dynamodb.Table;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Creating github secret in aws secrets manager

    // new secret

    // Configuring CI/CD pipeline

    new CodePipeline(this, "Pipeline", {
      synth: new ShellStep("synth", {
        input: CodePipelineSource.gitHub(
          "vernyuy/inventory-and-order-management",
          "main"
        ),
        commands: ["npm ci", "npm run build", "npx cdk synth"],
      }),
    });

    // cognito pool

    const userPool = new cognito.UserPool(this, "ims-project", {
      selfSignUpEnabled: true,
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      userVerification: {
        emailStyle: cognito.VerificationEmailStyle.CODE,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    new cognito.UserPoolClient(this, "imsUserPoolClient", {
      userPool,
    });

    // GraphQL API
    const api = new appsync.GraphqlApi(this, "ims-apis", {
      name: "api-for-ims",
      schema: appsync.SchemaFile.fromAsset("schema/schema.graphql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          },
        },
        additionalAuthorizationModes: [
          {
            authorizationType: appsync.AuthorizationType.USER_POOL,
            userPoolConfig: {
              userPool,
            },
          },
        ],
      },
      xrayEnabled: true,
      logConfig: {
        excludeVerboseContent: false,
        fieldLogLevel: appsync.FieldLogLevel.ALL,
      },
    });

    /////  DDB Table to store inventories

    const test_table = new dynamodb.Table(this, "test-table", {
      partitionKey: { name: "PK", type: dynamodb.AttributeType.STRING },
      sortKey: { type: dynamodb.AttributeType.STRING, name: "SK" },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    // DDB GSI
    const globalSecondaryIndexProps: dynamodb.GlobalSecondaryIndexProps = {
      indexName: "UserInventoryIndex",
      partitionKey: {
        name: "UserInventoryIndexPK",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "UserInventoryIndexSK",
        type: dynamodb.AttributeType.STRING,
      },
    };

    const globalSecondaryIndexProps2: dynamodb.GlobalSecondaryIndexProps = {
      indexName: "InventoryItemIndex",
      partitionKey: {
        name: "InventoryItemIndexSK",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "InventoryItemIndexPK",
        type: dynamodb.AttributeType.STRING,
      },
    };
    test_table.addGlobalSecondaryIndex(globalSecondaryIndexProps);
    test_table.addGlobalSecondaryIndex(globalSecondaryIndexProps2);
    //// Dynamodb table to register orders

    const orders_table = new dynamodb.Table(this, "order-table", {
      partitionKey: { name: "PK", type: dynamodb.AttributeType.STRING },
      sortKey: { type: dynamodb.AttributeType.STRING, name: "SK" },
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const globalSecondaryIndexOrderProps: dynamodb.GlobalSecondaryIndexProps = {
      indexName: "OrderItemIndex",
      partitionKey: {
        name: "OrderItemIndexPK",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "OrderItemIndexSK",
        type: dynamodb.AttributeType.STRING,
      },
    };

    orders_table.addGlobalSecondaryIndex(globalSecondaryIndexOrderProps);

    // SQS queue
    const dlq = new sqs.Queue(this, "mainQueueDlq", {
      visibilityTimeout: cdk.Duration.seconds(300),
      queueName: "dlq",
      deliveryDelay: cdk.Duration.millis(0),
      retentionPeriod: cdk.Duration.days(14),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    const queue = new sqs.Queue(this, "mainQueue", {
      visibilityTimeout: cdk.Duration.seconds(300),
      queueName: "mainQueue",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      deadLetterQueue: {
        maxReceiveCount: 5,
        queue: dlq,
      },
    });

    const SQSQueueSSLRequestsOnlyPolicy = new iam.PolicyStatement({
      actions: ["sqs:*"],
      effect: iam.Effect.DENY,
      principals: [new iam.AnyPrincipal()],
      conditions: { Bool: { "aws:SecureTransport": "false" } },
      resources: ["*"],
    });

    queue.addToResourcePolicy(SQSQueueSSLRequestsOnlyPolicy);

    dlq.addToResourcePolicy(SQSQueueSSLRequestsOnlyPolicy);

    /// Lambda to process orders
    // new LambdaFnsStack(this, "processOrder", {
    //   queue: queue,
    //   ddbTable: orders_table,
    //   env: { account: this.account, region: this.region },
    // });

    //  Stripe Webhook
    new StripeWebhookStack(this, "stripeWebhook", {
      orders_table: orders_table,
      inventory_table: test_table,
      env: { account: this.account, region: this.region },
    });
    // Mutation functions
    new OrderAppsyncFuncStack(this, "orderAppsynceFuncStack", {
      orders_table: orders_table,
      queue: queue,
      api: api,
      env: { account: this.account, region: this.region },
    });

    new InventoryAppsyncFuncStack(this, "InventoryAppsyncFuncStack", {
      inventories_table: test_table,
      api: api,
      env: { account: this.account, region: this.region },
    });

    // Query functions
    // new QueryAppsyncFuncStack(this, "GetAppsyncFuncStack", {
    //   api: api,
    //   env: { account: this.account, region: this.region },
    //   inventory_table: test_table,
    // });
  }
}
