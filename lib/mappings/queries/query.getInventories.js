import * as ddb from "@aws-appsync/utils/dynamodb";
export function request() {
  const query = {
    GSI2PK: { eq: "INVENTORY" },
  };
  return ddb.query({
    query,
    index: "InventoryItemIndex",
  });
}

export function response(ctx) {
  return ctx.result.items;
}
