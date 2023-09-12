export function request(ctx) {
  const inventoryId = ctx.args.input.inventoryId
    return {
    operation: 'PutItem',
    key: util.dynamodb.toMapValues({id: ctx.args.input.employeeId, sk:"ITEM#"+util.autoId(), typeName: "Item"}),
    attributeValues: util.dynamodb.toMapValues(ctx.args.input),
    };
}

  export function response(ctx) {
    return ctx.result;
  }