import { APIGatewayProxyResult } from "aws-lambda";
import * as AWS from "aws-sdk";
// const region = process.env.Region;

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME as string;

module.exports.lambdaHandler = async (
  event: any
): Promise<APIGatewayProxyResult> => {
  console.log(event.body);
  // get user email from the
  //   const body = event.body;

  //   let response: APIGatewayProxyResult;
  const body = JSON.parse(event.body);
  console.log(body.data.object.customer_email);
  //   console.log(body.customer_email);
  const email = body.data.object.customer_email;

  const customer = await docClient
    .scan({
      TableName: tableName,
      FilterExpression: `email = :email`,
      ExpressionAttributeValues: {
        ":email": email,
      },
    })
    .promise();
  console.log(customer);
  // const params = {
  //     TableName: tableName,
  //     "Item": {
  //         "pk": `USER#${body.userId}`,
  //         "sk": `PRODUCT#${body.productId}`,
  //         "productId": body.productId,
  //         "userId": body.userId,
  //         "quantity": body.quantity,
  //         "addedDate": Date.now().toString(),
  //         "cartProdcutStatus": "PENDING",
  //         }
  //     }
  // try{
  //     const res = await docClient.put(params).promise()

  //     response = {
  //         statusCode: 200,
  //         body: JSON.stringify({
  //             message: 'successfully added product to cart'
  //         })
  //     }

  // }catch(err: any){
  //     response = {
  //         statusCode: 500,
  //         body: JSON.stringify({
  //             message: 'Failed to add to cart'
  //         })
  //     }
  // }
  const message = "HEllo form me";
  const name = "test";
  sendEmail({ name, email, message });
  return event;
};
export type ContactDetails = {
  name: string;
  email: string;
  message: string;
};

async function sendEmail({ name, email, message }: ContactDetails) {
  const ses = new AWS.SES({ region: process.env.REGION });
  const test = await ses
    .sendEmail(sendEmailParams({ name, email, message }))
    .promise();
  console.log("EMaill::  ", test);
  return JSON.stringify({
    body: { message: "Email sent successfully 🎉🎉🎉" },
    statusCode: 200,
  });
}

function sendEmailParams({ name, email, message }: ContactDetails) {
  return {
    Destination: {
      ToAddresses: ["fonchu.e.venyuy@gmail.com", email],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: getHtmlContent({ name, email, message }),
        },
        Text: {
          Charset: "UTF-8",
          Data: getTextContent({ name, email, message }),
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `Email from example ses app.`,
      },
    },
    Source: "venyuyestelle@gmail.com",
  };
}

function getHtmlContent({ name, email, message }: ContactDetails) {
  return `
    <html>
      <body>
        <h1>Received an Email. 📬</h1>
        <h2>Sent from: </h2>
        <ul>
          <li style="font-size:18px">👤 <b>${name}</b></li>
          <li style="font-size:18px">✉️ <b>${email}</b></li>
        </ul>
        <p style="font-size:18px">${message}</p>
      </body>
    </html> 
  `;
}

function getTextContent({ name, email, message }: ContactDetails) {
  return `
    Received an Email. 📬
    Sent to:
        👤 ${name}
        ✉️ ${email}
    ${message}
  `;
}
