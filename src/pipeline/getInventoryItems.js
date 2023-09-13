import { util } from "@aws-appsync/utils";
import { scan } from "@aws-appsync/utils/dynamodb";
export function request(ctx) {
  const { id } = ctx.args;
  const filter = {
    expression: "begins_with(sk, :sk) and inventoryId = :inventoryId",
    expressionValues: {
      ":sk": { S: "ITEM#" },
      ":inventoryId": id,
    },
  };
  return {
    operation: "Scan",
    filter: filter,
  };
}

export function response(ctx) {
  return ctx.result.items;
}
