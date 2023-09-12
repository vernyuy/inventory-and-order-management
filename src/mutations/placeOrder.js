export function request(ctx) {
  return {
    operation: "PutItem",
    key: util.dynamodb.toMapValues({
      id: ctx.args.input.user,
      sk: "ORDER#" + util.autoId(),
      orderStatus: "PENDING",
      orderItems: [],
      total_items: 0,
    }),
    attributeValues: util.dynamodb.toMapValues(ctx.args.input),
  };
}

export function response(ctx) {
  return ctx.result;
}
