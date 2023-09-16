import { util } from "@aws-appsync/utils";
export function request() {
  const query = JSON.parse(
    util.transform.toDynamoDBConditionExpression({
      GSI2PK: { eq: "ITEM" },
    })
  );
  return {
    operation: "Query",
    query,
    index: "GSI2",
  };
}

export function response(ctx) {
  return ctx.result.items;
}
