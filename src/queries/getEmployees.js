import { util } from "@aws-appsync/utils";
export function request(ctx) {
  console.log("CONTEXT::   ", ctx);
  const query = JSON.parse(
    util.transform.toDynamoDBConditionExpression({
      GSI1PK: { eq: "USER" },
    })
  );
  return {
    operation: "Query",
    query,
    index: "GSI1",
  };
}

export function response(ctx) {
  return ctx.result.items;
}
