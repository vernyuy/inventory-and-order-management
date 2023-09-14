import { util } from "@aws-appsync/utils";
export function request() {
  return {
    operation: "Query",
    filter: JSON.parse(
      util.transform.toDynamoDBConditionExpression({
        id: { eq: "USER" },
      })
    ),
  };
}

export function response(ctx) {
  return ctx.result.items;
}
