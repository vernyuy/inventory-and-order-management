import * as cdk from 'aws-cdk-lib';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { join } from 'path'
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as stepfunctions from "aws-cdk-lib/aws-stepfunctions";
import * as fs from 'fs'
import * as iam from 'aws-cdk-lib/aws-iam'
import { BillingMode } from "aws-cdk-lib/aws-dynamodb";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import path = require('path');
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';


// declare const function_: lambda.Function;
// declare const graphqlApi_ : appsync.GraphqlApi
// declare const role: iam.Role



export class CdkImsProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);




    // cognito pool

    const userPool  =  new cognito.UserPool(this, 'ims-project',{
      selfSignUpEnabled: true,
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      userVerification: {
        emailStyle: cognito.VerificationEmailStyle.CODE
      },
      autoVerify: {
        email: true
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true
        }
      }
    });

    const userPoolClient = new cognito.UserPoolClient(this, 'imsUserPoolClient', {
      userPool
    })

    // makes a GraphQL API
    const api = new appsync.GraphqlApi(this, 'ims-apis', {
      name: 'api-for-ims',
      schema: appsync.SchemaFile.fromAsset('schema/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365))
          }
        },
        additionalAuthorizationModes: [{
          authorizationType: appsync.AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool
          }
        }]
      },
      xrayEnabled: true,
			logConfig: {
				excludeVerboseContent: false,
				fieldLogLevel: appsync.FieldLogLevel.ALL,
			},
    });

    /////           DDB Table

    const test_table = new dynamodb.Table(this, 'test-table', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING,},
      sortKey: {type: dynamodb.AttributeType.STRING, name:'sk' },
      
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const globalSecondaryIndexProps: dynamodb.GlobalSecondaryIndexProps = {
      indexName: 'GSI1',
      partitionKey: {
        name: 'GSI1PK',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'GSI1SK',
        type: dynamodb.AttributeType.STRING,
      },
    }; 

    test_table.addGlobalSecondaryIndex(globalSecondaryIndexProps);

    const DDBDataSource = api.addDynamoDbDataSource(
			'DDBDataSource',
			test_table
		)


    //// Dynamodb table to register orders

    const orders_table = new dynamodb.Table(this, 'order-table', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING,},
      sortKey: {type: dynamodb.AttributeType.STRING, name:'sk' },
      
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const globalSecondaryIndexOrderProps: dynamodb.GlobalSecondaryIndexProps = {
      indexName: 'GSI1',
      partitionKey: {
        name: 'GSI1PK',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'GSI1SK',
        type: dynamodb.AttributeType.STRING,
      },
    }; 
    
    orders_table.addGlobalSecondaryIndex(globalSecondaryIndexOrderProps)

    const OrdersDS = api.addDynamoDbDataSource(
			'Order_data_source',
			orders_table
		)


///////////////////////////////////////////////////////////////////

const queue = new sqs.Queue(this, 'mainQueue',{
  visibilityTimeout: cdk.Duration.seconds(300),
  queueName: 'mainQueue.fifo',
  fifo: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY
})

const queueConsumer = new lambda.Function(this, 'consumerFunction', {
  handler: 'queueConsumer.lambdaHandler',
  runtime: lambda.Runtime.NODEJS_14_X,
  code: lambda.Code.fromAsset('src'),
  environment: {
    'TABLE_NAME': orders_table.tableName,
    'QUEUE_URL': queue.queueName
  },
});


const streamConsumer = new lambda.Function(this, 'streamConsumer', {
  handler: 'streamConsumer.lambdaHandler',
  runtime: lambda.Runtime.NODEJS_14_X,
  code: lambda.Code.fromAsset('src'),
  environment: {
    'TABLE_NAME': orders_table.tableName,
    'QUEUE_URL': queue.queueName
  },
  role: queueConsumer.role,
});


const process_order = new lambda.Function(this, 'processOrder', {
  handler: 'placeOrder.lambdaHandler',
  runtime: lambda.Runtime.NODEJS_18_X,
  code: lambda.Code.fromAsset('src'),
  environment: {
    'TABLE_NAME': orders_table.tableName,
    'QUEUE_URL': queue.queueName
  },
  role: queueConsumer.role,
})

orders_table.grantStreamRead(streamConsumer)
orders_table.grantStreamRead(process_order)
///////////////////////////////////////////////////////////////////
    /**
     * Add Item to cart
     * 
     */
    const add_item_to_cart1 = new appsync.AppsyncFunction(this, 'add_item_to_cart1', {
      name: 'add_item_to_Cart1',
      api,
      dataSource: OrdersDS,
      code: appsync.Code.fromAsset('src/mutations/addItemToCart.js'),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

    new appsync.Resolver(this, 'pipeline-resolver-add-item-to-cart', {
      api,
      typeName: 'Mutation',
      fieldName: 'addItemToCart',
      code: appsync.Code.fromAsset('src/pipeline/addItemToCart.js'),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [add_item_to_cart1],
    });


    /**
     * Place order
     * 
     */
    const place_order = new appsync.AppsyncFunction(this, 'place_order', {
      name: 'place_order',
      api,
      dataSource: OrdersDS,
      code: appsync.Code.fromAsset('src/mutations/placeOrder.js'),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

    new appsync.Resolver(this, 'pipeline-resolver-place_order', {
      api,
      typeName: 'Mutation',
      fieldName: 'placeOrder',
      code: appsync.Code.fromAsset('src/pipeline/addItemToCart.js'),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [place_order],
    });

    /**
     * Get Users Inventory details
     */
    const getUserInventoriesFunc = new appsync.AppsyncFunction(
			this,
			'getUserInventories',
			{
				name: 'getUserInventoriesFunc',
				api,
				dataSource: DDBDataSource,
				code: appsync.Code.fromAsset('src/pipeline/getUserInventories.js'
					// join(__dirname, '/getUserInventories.js')
				),
				runtime: appsync.FunctionRuntime.JS_1_0_0,
			}
		)

    const passthrough = appsync.InlineCode.fromInline(`
        // The before step
        export function request(...args) {
          console.log(args);
          return {}
        }

        // The after step
        export function response(ctx) {
          return ctx.prev.result
        }
    `)

    new appsync.Resolver(
			this,
			'getUserInventoriesRes',
			{
				api,
				typeName: 'Query',
				fieldName: 'getUserInventories',
				runtime: appsync.FunctionRuntime.JS_1_0_0,
				pipelineConfig: [getUserInventoriesFunc],
				code: passthrough,
			}
		)


    /**
     * Get Users
     */

    
    const get_func = new appsync.AppsyncFunction(this, 'func-get-emp', {
      name: 'get_emp_func',
      api,
      dataSource: api.addDynamoDbDataSource('ims-table-1', test_table),
      code: appsync.Code.fromAsset('src/pipeline/getEmployees.js'),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

    new appsync.Resolver(this, 'pipeline-resolver-get-emp', {
      api,
      typeName: 'Query',
      fieldName: 'users',
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [get_func],
      code: passthrough
    });

    /**
     * Get Inventories
     */
    const get_inventories = new appsync.AppsyncFunction(this, 'func-get-inventories', {
      name: 'get_inventories_function',
      api,
      dataSource: DDBDataSource,
      code: appsync.Code.fromAsset('src/pipeline/getInventories.js'),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

    new appsync.Resolver(this, 'pipeline-resolver-get-inventories', {
      api,
      typeName: 'Query',
      fieldName: 'inventories',
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [get_inventories],
      code: passthrough
    });

    /**
     * Get Items
     */

    const get_items = new appsync.AppsyncFunction(this, 'func-get-items', {
      name: 'get_items_func',
      api,
      dataSource: DDBDataSource,
      code: appsync.Code.fromAsset('src/pipeline/getItems.js'),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

    new appsync.Resolver(this, 'pipeline-resolver-get-items', {
      api,
      typeName: 'Query',
      fieldName: 'items',
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [get_items],
      code: passthrough
    });


    /**
     * Get inventory Items
     */

    const get_inentory_items = new appsync.AppsyncFunction(this, 'get-inventory-items', {
      name: 'inventory_items_func',
      api,
      dataSource: DDBDataSource,
      code: appsync.Code.fromAsset('src/pipeline/getInventoryItems.js'),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

    new appsync.Resolver(this, 'pipeline-resolver-get-inventory-items', {
      api,
      typeName: 'Query',
      fieldName: 'getInventoryItems',
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [get_inentory_items],
      code: passthrough
    });

  ///////////////////////////////////////////////////////////////////////////////////////////////
/**
 *  The Blog below is the set to run Mutations in our system
 * 
 * 
 */
    // Creates a function for mutation

    /**
     * Create user
     * 
     */
    const add_emp = new appsync.AppsyncFunction(this, 'func-add-post', {
      name: 'add_employee',
      api,
      dataSource: api.addDynamoDbDataSource('table-for-posts-2', test_table),
      code: appsync.Code.fromAsset('src/mutations/createEmployee.js'),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

    new appsync.Resolver(this, 'pipeline-resolver-create-posts', {
      api,
      typeName: 'Mutation',
      fieldName: 'createUser',
      code: appsync.Code.fromAsset('src/pipeline/createEmployee.js'),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [add_emp],
    });

    /**
     * Create inventory
     */

    const add_inventory = new appsync.AppsyncFunction(this, 'func-add-inventory', {
      name: 'add_inventory',
      api,
      dataSource: api.addDynamoDbDataSource('table-for-inventory', test_table),
      code: appsync.Code.fromAsset('src/mutations/createInventory.js'),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

    new appsync.Resolver(this, 'pipeline-resolver-create-inventory', {
      api,
      typeName: 'Mutation',
      fieldName: 'createInventory',
      code: appsync.Code.fromAsset('src/pipeline/createInventory.js'),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [add_inventory],
    });

    /**
     * Create Item
     */

    const add_item = new appsync.AppsyncFunction(this, 'func-add-item', {
      name: 'add_item',
      api,
      dataSource: DDBDataSource,
      code: appsync.Code.fromAsset('src/mutations/createItem.js'),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });
    
    new appsync.Resolver(this, 'pipeline-resolver-create-item', {
      api,
      typeName: 'Mutation',
      fieldName: 'createItem',
      code: appsync.Code.fromAsset('src/pipeline/createItem.js'),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [add_item],
    });

  }
}
