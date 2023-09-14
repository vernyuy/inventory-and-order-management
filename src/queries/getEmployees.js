import { util } from "@aws-appsync/utils";
export function request() {
  return {
    operation: "Query",
    filter: JSON.parse(
      util.transform.toDynamoDBConditionExpression({
        id: { eq: "USER" },
      })
    ),
    // filter: {
    //     expression: 'sk = :sk',
    //     expressionValues: {
    //         ':sk': {'S':'USER'}
    //     },
    // },
  };
}

export function response(ctx) {
  return ctx.result.items;
}
