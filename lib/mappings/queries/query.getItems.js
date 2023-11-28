import { util } from "@aws-appsync/utils";
export function request(ctx) {
  const { limit, nextToken } = ctx.args;
  const query = JSON.parse(
    util.transform.toDynamoDBConditionExpression({
      UserItemIndexPK: { eq: "ITEM" },
    })
  );

  return {
    operation: "Query",
    query,
    index: "UserItemIndex",
    limit,
    nextToken,
  };
}

export function response(ctx) {
  return ctx.result;
}
