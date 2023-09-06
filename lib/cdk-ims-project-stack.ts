import * as cdk from 'aws-cdk-lib';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { join } from 'path'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

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
      }
    });

    //creates a DDB table
    // const user_table = new dynamodb.Table(this, 'user-table', {
    //   partitionKey: {
    //     name: 'id',
    //     type: dynamodb.AttributeType.STRING,
    //   },
    //   removalPolicy: cdk.RemovalPolicy.DESTROY,
    //   // sortKey:{
    //   //   name: 'role',
    //   //   type: dynamodb.AttributeType.STRING
    //   // }
    // });

    const test_table = new dynamodb.Table(this, 'test-table', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING,},
      sortKey: {type: dynamodb.AttributeType.STRING, name:'sk' },
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    // const items_table = new dynamodb.Table(this, 'items-table', {
    //   partitionKey: {
    //     name: 'id',
    //     type: dynamodb.AttributeType.STRING,
    //   },
    // });

    // const orders_table = new dynamodb.Table(this, 'orders-table', {
    //   partitionKey: {
    //     name: 'id',
    //     type: dynamodb.AttributeType.STRING,
    //   },
    // });

    // const inventory_table = new dynamodb.Table(this, 'inventory-table', {
    //   partitionKey: {
    //     name: 'id',
    //     type: dynamodb.AttributeType.STRING,
    //   },
    //   removalPolicy: cdk.RemovalPolicy.DESTROY,
    // });

    const DDBDataSource = api.addDynamoDbDataSource(
			'DDBDataSource',
			test_table
		)
    // Creates a function for query
    const getUserInventoriesFunc = new appsync.AppsyncFunction(
			this,
			'getUserInventories',
			{
				name: 'getUserInventoriesFunc',
				api,
				dataSource: DDBDataSource,
				code: appsync.Code.fromAsset(
					join(__dirname, '/getUserInventories.js')
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


    
    const get_func = new appsync.AppsyncFunction(this, 'func-get-emp', {
      name: 'get_emp_func',
      api,
      dataSource: api.addDynamoDbDataSource('ims-table-1', test_table),
      code: appsync.Code.fromInline(`
        export function request(ctx) {
          return { operation: 'Scan' };
        }
        
        export function response(ctx) {
            return ctx.result.items;
        }
      `),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

    const get_items = new appsync.AppsyncFunction(this, 'func-get-items', {
      name: 'get_items_func',
      api,
      dataSource: DDBDataSource,
      code: appsync.Code.fromInline(`
        export function request(ctx) {
          return { operation: 'Scan' };
        }
        
        export function response(ctx) {
            return ctx.result.items;
        }
      `),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

    // const get_oders = new appsync.AppsyncFunction(this, 'func-get-orders', {
    //   name: 'get_orders_func',
    //   api,
    //   dataSource: api.addDynamoDbDataSource('orders-table', orders_table),
    //   code: appsync.Code.fromInline(`
    //     export function request(ctx) {
    //       return { operation: 'Scan' };
    //     }
        
    //     export function response(ctx) {
    //         return ctx.result.items;
    //     }
    //   `),
    //   runtime: appsync.FunctionRuntime.JS_1_0_0,
    // });

    // const get_itemLines = new appsync.AppsyncFunction(this, 'func-get-itemLines', {
    //   name: 'get_itemLines_func',
    //   api,
    //   dataSource: api.addDynamoDbDataSource('itemLines-table', itemLine_table),
    //   code: appsync.Code.fromInline(`
    //     export function request(ctx) {
    //       return { operation: 'Scan' };
    //     }
        
    //     export function response(ctx) {
    //         return ctx.result.items;
    //     }
    //   `),
    //   runtime: appsync.FunctionRuntime.JS_1_0_0,
    // });

    const get_inventories = new appsync.AppsyncFunction(this, 'func-get-inventories', {
      name: 'get_inventories_function',
      api,
      dataSource: api.addDynamoDbDataSource('inventory-table', test_table),
      code: appsync.Code.fromInline(`
        export function request(ctx) {
          return { operation: 'Scan' };
        }
        
        export function response(ctx) {
            return ctx.result.items;
        }
      `),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

    // Creates a function for mutation
    const add_emp = new appsync.AppsyncFunction(this, 'func-add-post', {
      name: 'add_employee',
      api,
      dataSource: api.addDynamoDbDataSource('table-for-posts-2', test_table),
      code: appsync.Code.fromAsset('src/mutations/createEmployee.js'),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

    const add_inventory = new appsync.AppsyncFunction(this, 'func-add-inventory', {
      name: 'add_inventory',
      api,
      dataSource: api.addDynamoDbDataSource('table-for-inventory', test_table),
      code: appsync.Code.fromAsset('src/mutations/createInventory.js'),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

    const add_item = new appsync.AppsyncFunction(this, 'func-add-item', {
      name: 'add_item',
      api,
      dataSource: DDBDataSource,
      code: appsync.Code.fromAsset('src/mutations/createItem.js'),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

    // const add_order = new appsync.AppsyncFunction(this, 'func-add-order', {
    //   name: 'add_order',
    //   api,
    //   dataSource: api.addDynamoDbDataSource('table-for-orders', orders_table),
    //   code: appsync.Code.fromAsset('src/mutations/createOrder.js'),
    //   runtime: appsync.FunctionRuntime.JS_1_0_0,
    // });

    // const add_itemLine = new appsync.AppsyncFunction(this, 'func-add-itemLine', {
    //   name: 'add_itemLine',
    //   api,
    //   dataSource: api.addDynamoDbDataSource('table-for-itemLine', itemLine_table),
    //   code: appsync.Code.fromAsset('src/mutations/createItemLine.js'),
    //   runtime: appsync.FunctionRuntime.JS_1_0_0,
    // });

    // Adds a pipeline resolver with the get function
    new appsync.Resolver(this, 'pipeline-resolver-get-emp', {
      api,
      typeName: 'Query',
      fieldName: 'users',
      code: appsync.Code.fromAsset('src/pipeline/getEmployees.js'),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [get_func],
    });

    new appsync.Resolver(this, 'pipeline-resolver-get-inventories', {
      api,
      typeName: 'Query',
      fieldName: 'inventories',
      code: appsync.Code.fromAsset('src/pipeline/getInventory.js'),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [get_inventories],
    });

    new appsync.Resolver(this, 'pipeline-resolver-get-items', {
      api,
      typeName: 'Query',
      fieldName: 'items',
      code: appsync.Code.fromAsset('src/pipeline/getItem.js'),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [get_items],
    });

    // new appsync.Resolver(this, 'pipeline-resolver-get-orders', {
    //   api,
    //   typeName: 'Query',
    //   fieldName: 'orders',
    //   code: appsync.Code.fromAsset('src/pipeline/getOrders.js'),
    //   runtime: appsync.FunctionRuntime.JS_1_0_0,
    //   pipelineConfig: [get_oders],
    // });

    // Adds a pipeline resolver with the create function
    new appsync.Resolver(this, 'pipeline-resolver-create-posts', {
      api,
      typeName: 'Mutation',
      fieldName: 'createUser',
      code: appsync.Code.fromAsset('src/pipeline/createEmployee.js'),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [add_emp],
    });

    new appsync.Resolver(this, 'pipeline-resolver-create-inventory', {
      api,
      typeName: 'Mutation',
      fieldName: 'createInventory',
      code: appsync.Code.fromAsset('src/pipeline/createInventory.js'),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [add_inventory],
    });

    new appsync.Resolver(this, 'pipeline-resolver-create-item', {
      api,
      typeName: 'Mutation',
      fieldName: 'createItem',
      code: appsync.Code.fromAsset('src/pipeline/createItem.js'),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [add_item],
    });

    // new appsync.Resolver(this, 'pipeline-resolver-create-order', {
    //   api,
    //   typeName: 'Mutation',
    //   fieldName: 'createOrder',
    //   code: appsync.Code.fromAsset('src/pipeline/createOrder.js'),
    //   runtime: appsync.FunctionRuntime.JS_1_0_0,
    //   pipelineConfig: [add_order],
    // });

  }
}
