import { util } from "@aws-appsync/utils";
export function request() {
  // const query = JSON.parse(
  //   util.transform.toDynamoDBConditionExpression({
  //     GSI1PK: { eq: "INVENTORY" },
  //     GSI1SK: { begins_with: "INVENTORY#" },
  //   })
  // );
  return {
    operation: "Query",
    query: {
      expression: "GSI1PK = :GSI1PK and begins_with(GSI1SK, :GSI1SK)",
      expressionValues: util.dynamodb.toMapValues({
        ":GSI1PK": "INVENTORY",
        ":GSI1SK": "INVENTORY#",
      }),
    },
  };
}

export function response(ctx) {
  return ctx.result.items;
}
