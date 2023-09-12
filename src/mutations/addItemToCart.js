export function request(ctx) {
  return {
    operation: "PutItem",
    key: util.dynamodb.toMapValues({
      id: ctx.args.input.user,
      sk: "ITEM#" + ctx.args.input.item,
      cartProductStatus: "PENDING",
    }),
    attributeValues: util.dynamodb.toMapValues(ctx.args.input),
  };
}

export function response(ctx) {
  return ctx.result;
}
