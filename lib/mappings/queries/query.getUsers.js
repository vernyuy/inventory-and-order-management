import * as ddb from "@aws-appsync/utils/dynamodb";
export function request(ctx) {
  console.log("CONTEXT::   ", ctx);
  const query = {
    UserInventoryIndexPK: { eq: "USER" },
  };
  return ddb.query({
    query,
    index: "UserInventoryIndex",
  });
}

export function response(ctx) {
  console.log(ctx.result.items);
  return ctx.result;
}
