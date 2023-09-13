import { scan } from "@aws-appsync/utils/dynamodb";

export function request() {
  const filter = {
    expression: "begins_with(sk, :sk) and typeName = Inventory",
    expressionValues: {
      ":sk": { S: "INVENT#" },
    },
  };

  return scan({ filter: filter });
}

export function response(ctx) {
  return ctx.result.items;
}
