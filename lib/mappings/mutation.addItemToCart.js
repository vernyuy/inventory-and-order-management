export function request(ctx) {
  return {
    operation: "Invoke",
    payload: {
      field: "addItemToCart",
      arguments: ctx.args,
    },
  };
}
