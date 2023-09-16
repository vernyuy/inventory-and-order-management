import { util } from "@aws-appsync/utils";
export function request(ctx) {
  const inventoryId = ctx.args.input.inventoryId;
  console.log(inventoryId);
  return {
    operation: "Query",
    query: {
      expression: "GSI1PK = :GSI1PK and begins_with(GSI1SK, :GSI1SK)",
      expressionValues: util.dynamodb.toMapValues({
        ":GSI1PK": "INVENTORY#" + inventoryId,
        ":GSI1SK": "ITEM#",
      }),
    },
  };
}

export function response(ctx) {
  let { items } = ctx.result;
  return items;
}
