export function request(ctx) {
    return {
    operation: 'PutItem',
    key: util.dynamodb.toMapValues({id: ctx.args.input.employee, sk: "INVENT#" + util.autoId(), typeName: "Inventory"}),
    attributeValues: util.dynamodb.toMapValues(ctx.args.input),
  };
}

  export function response(ctx) {
  

    return ctx.result;
  }