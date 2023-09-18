import * as ddb from "@aws-appsync/utils/dynamodb";
export function request(ctx) {
  console.log("CONTEXT::   ", ctx);
  const query = {
    GSI1PK: { eq: "USER" },
  };
  return ddb.query({
    query,
    limit: 10,
    index: "UserInventoryIndex",
  });
}

export function response(ctx) {
  return ctx.result.items;
}
