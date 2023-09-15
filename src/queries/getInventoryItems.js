import { util } from "@aws-appsync/utils";
export function request(ctx) {
  const { id } = ctx.args;
  console.log(id);
  return {
    operation: "Query",
    query: {
      expression: "GSI1PK = :GSI1PK and begins_with(GSI1SK, :GSI1SK)",
      expressionValues: util.dynamodb.toMapValues({
        ":GSI1PK": "INVENTORY#" + id,
        ":GSI1SK": "ITEM#",
      }),
    },
  };
}

export function response(ctx) {
  let { items } = ctx.result;
  return items;
}
