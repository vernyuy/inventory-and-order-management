import { util } from "@aws-appsync/utils";
export function request() {
  const query = JSON.parse(
    util.transform.toDynamoDBConditionExpression({
      GSI1PK: { eq: "INVENTORY" },
    })
  );
  return { operation: "Query", query };
}

export function response(ctx) {
  return ctx.result.items;
}