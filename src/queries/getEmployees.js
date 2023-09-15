import { util } from "@aws-appsync/utils";
export function request() {
  return {
    operation: "Query",
    query: {
      expression: "id = :id and begins_with(sk, :sk)",
      expressionValues: util.dynamodb.toMapValues({
        ":id": "USER",
        ":sk": "USER#",
      }),
    },
  };
}

export function response(ctx) {
  return ctx.result.items;
}
