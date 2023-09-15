import { util } from "@aws-appsync/utils";
export function request(ctx) {
  console.log("CONTEXT::   ", ctx);
  const query = JSON.parse(
    util.transform.toDynamoDBConditionExpression({
      id: { eq: "USER" },
      sk: { beginsWith: "USER#" },
    })
  );
  return {
    operation: "Query",
    query,
  };
}

export function response(ctx) {
  return ctx.result.items;
}
