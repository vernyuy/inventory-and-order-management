import * as ddb from "@aws-appsync/utils/dynamodb";
export function request(ctx) {
  const inventoryId = ctx.args.employeeId;
  console.log(inventoryId);
  const query = {
    GSI1PK: { eq: `INVENTORY#${inventoryId}` },
    GSI1SK: { begins_with: "ITEM#" },
  };
  return ddb.query({
    query,
    index: "UserInventoryIndex",
  });
}

export function response(ctx) {
  return ctx.result;
}
