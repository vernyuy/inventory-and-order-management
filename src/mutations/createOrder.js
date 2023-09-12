export function request(ctx) {
    return {
      operation: 'PutItem',
      key: util.dynamodb.toMapValues({id: util.autoId()}),
      attributeValues: util.dynamodb.toMapValues(ctx.args.input),
    };
  }

  export function response(ctx) {
    return ctx.result;
  }