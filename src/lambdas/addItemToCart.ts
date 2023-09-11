import * as AWS from 'aws-sdk';
const tableName = process.env.tableName as string;
const ddb = new AWS.DynamoDB.DocumentClient();

export function handler(event: any, context: any, callback: any) {
    const method = event.httpMethod;
    console.log("Context:::::  ",event)
    const resource = event.resource;
    console.log("Event:::::  ",event)
    if(method === "POST" && resource ==='/cart/add'){
        return addProductToCart(event);
    }else{
        return {
            statusCode: 404,
            body: JSON.stringify({
                message: 'Not found'
            })
        }
    }
}

async function addProductToCart(event: any){
    const body = JSON.parse(event.body);
    const params = {
        TableName: tableName,
        "Item": {
            "id": body.user,
            "sk": `ITEM#${body.item}`,
            "productId": body.item,
            "userId": body.user,
            "quantity": body.quantity,
            "price": body.unit_price*body.quantity,
            "addedDate": Date.now().toString(),
            "cartProductStatus": "PENDING",
            }
        }
    try{
        const res = await ddb.put(params).promise()
    
        console.log("Cart add; ", res)
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'successfully added product to cart'
            })
        }
    
    }catch(err: any){
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Failed to add to cart'
            })
        }
    }}