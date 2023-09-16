import * as cdk from "aws-cdk-lib";
import * as appsync from "aws-cdk-lib/aws-appsync";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { LambdaStack } from "./compute/lambdaStack";
import { StripeWebhookStack } from "./compute/stripe-webhook-stack";
import { OrderAppsyncFuncStack } from "./mappings/mutations/functions/order-appsync-func-stack";
import { InventoryAppsyncFuncStack } from "./mappings/mutations/functions/inventory-appsync-func-stack";
import { GetAppsyncFuncStack } from "./mappings/queries/get-appsync-func-stack";
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from "aws-cdk-lib/pipelines";

export class CdkImsProjectStack extends cdk.Stack {
  public orders_table: dynamodb.Table;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Configuring CI/CD pipeline

    new CodePipeline(this, "Pipeline", {
      synth: new ShellStep("synth", {
        input: CodePipelineSource.gitHub(
          "EducloudHQ/inventory-management",
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
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      sortKey: { type: dynamodb.AttributeType.STRING, name: "sk" },

      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    // DDB GSI
    const globalSecondaryIndexProps: dynamodb.GlobalSecondaryIndexProps = {
      indexName: "GSI1",
      partitionKey: {
        name: "GSI1PK",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "GSI1SK",
        type: dynamodb.AttributeType.STRING,
      },
    };

    const globalSecondaryIndexProps2: dynamodb.GlobalSecondaryIndexProps = {
      indexName: "GSI2",
      partitionKey: {
        name: "GSI2PK",
        type: dynamodb.AttributeType.STRING,
      },
    };
    test_table.addGlobalSecondaryIndex(globalSecondaryIndexProps);
    test_table.addGlobalSecondaryIndex(globalSecondaryIndexProps2);
    //// Dynamodb table to register orders

    const orders_table = new dynamodb.Table(this, "order-table", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      sortKey: { type: dynamodb.AttributeType.STRING, name: "sk" },
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const globalSecondaryIndexOrderProps: dynamodb.GlobalSecondaryIndexProps = {
      indexName: "GSI1",
      partitionKey: {
        name: "GSI1PK",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "GSI1SK",
        type: dynamodb.AttributeType.STRING,
      },
    };

    orders_table.addGlobalSecondaryIndex(globalSecondaryIndexOrderProps);

    // SQS queue
    const queue = new sqs.Queue(this, "mainQueue", {
      visibilityTimeout: cdk.Duration.seconds(300),
      queueName: "mainQueue.fifo",
      fifo: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    /// Lambda to process orders
    new LambdaStack(this, "processOrder", {
      queue: queue,
      ddbTable: orders_table,
      env: { account: this.account, region: this.region },
    });

    //  Stripe Webhook
    new StripeWebhookStack(this, "stripeWebhook", {
      orders_table: orders_table,
      inventory_table: test_table,
      env: { account: this.account, region: this.region },
    });
    // Mutation functions
    new OrderAppsyncFuncStack(this, "orderAppsynceFuncStack", {
      orders_table: orders_table,
      api: api,
      env: { account: this.account, region: this.region },
    });

    new InventoryAppsyncFuncStack(this, "InventoryAppsyncFuncStack", {
      inventories_table: test_table,
      api: api,
      env: { account: this.account, region: this.region },
    });

    // Query functions
    new GetAppsyncFuncStack(this, "GetAppsyncFuncStack", {
      api: api,
      env: { account: this.account, region: this.region },
      inventory_table: test_table,
    });
  }
}
