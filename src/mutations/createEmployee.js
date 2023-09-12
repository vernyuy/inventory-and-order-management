export function request(ctx) {
  return {
    operation: "PutItem",
    key: util.dynamodb.toMapValues({
      id: util.autoId(),
      sk: "USER",
      typeName: "User",
    }),
    attributeValues: util.dynamodb.toMapValues(ctx.args.input),
  };
}

export function response(ctx) {
  return ctx.result;
}
