import * as ddb from "@aws-appsync/utils/dynamodb";
export function request(ctx) {
  console.log("CONTEXT::   ", ctx);
  const { limit, nextToken } = ctx.args;
  const query = {
    UserItemIndexPK: { eq: "USER" },
  };
  return ddb.query({
    query,
    index: "UserItemIndex",
    limit,
    nextToken,
  });
}

export function response(ctx) {
  console.log(ctx.result.items);
  return ctx.result;
}
