import { util } from "@aws-appsync/utils";
export function request(ctx) {
  const { id } = ctx.args;
  console.log(id);
  const query = JSON.parse(
    util.transform.toDynamoDBConditionExpression({
      GSI1PK: { eq: "INVENTORY#" + id },
      GSI1SK: { beginsWith: "ITEM#" },
    })
  );
  return { operation: "Query", query };
}

export function response(ctx) {
  let { items } = ctx.result;
  return items;
}
