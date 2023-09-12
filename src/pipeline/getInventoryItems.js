import { util } from "@aws-appsync/utils";

export function request(ctx) {
  const { id } = ctx.args;
  return {
    operation: "Scan",
    filter: {
      expression: "begins_with(sk, :sk) and inventoryId = :inventoryId",
      expressionValues: {
        ":sk": { S: "ITEM#" },
        inventoryId: { S: id },
      },
    },
  };
}

export function response(ctx) {
  return ctx.result.items;
}
