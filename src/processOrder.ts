import { APIGatewayProxyEvent, APIGatewayProxyResult, DynamoDBStreamEvent } from 'aws-lambda';
import * as AWS from "aws-sdk";
import { v4 as uuidv4 } from 'uuid';

const region = process.env.Region;

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME as string;

module.exports.lambdaHandler = async (event: any): Promise<DynamoDBStreamEvent>=> {
    console.log(event)
    // let response: APIGatewayProxyResult;
    // const body = event.pathParameters.userId
    // const userId = event.pathParameters.userId
    // const orderId = uuidv4()
    // console.log(userId)
    
    // try{
    //     const cartItems = await docClient.query({
    //         TableName: tableName,
    //         KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
    //         FilterExpression: 'cartProdcutStatus = :status AND userId = :userId',
    //         ProjectionExpression: 'productId, quantity',
    //         ExpressionAttributeValues: {
    //             ':pk': `USER#${userId}`,
    //             ':sk': 'PRODUCT#',
    //             ':status': 'PENDING',
    //             ':userId': userId
    //         }
    //     }).promise();
    //     try{
    //         const result = await docClient.update({
    //             TableName:tableName,
    //             Key:{
    //                 'pk':'ORDER',
    //                 'sk':`ORDER#${orderId}`
    //             },
    //             ConditionExpression: 'userId = :userId',
    //             UpdateExpression: 'set orderItems = :orderItems, orderStatus = :orderStatus',
    //             // ReturnValues: 'UPDATED_NEW',
    //             ExpressionAttributeValues:{
    //                 ':orderItems': cartItems.Items,
    //                 ':orderStatus': 'ORDERED',
    //                 ':userId': userId
    //             }
    //         }).promise()
    //     }catch(err){
    //         response = {
    //             statusCode: 500,
    //             body: JSON.stringify({
    //                 error: err
    //             })
            
    //         }
    //     }
    //     response = { statusCode: 200,
    //         body: JSON.stringify({
    //             message: "Checked out successfully"
    //         })
    //     }
    // }catch(err){
    //     response = {
    //         statusCode: 500,
    //         body: JSON.stringify({
    //             error: err
    //         })
        
    //     }
    // }

    // return response;
    return event
};