export function request() {
  return {
    operation: 'Scan',
    filter: {
        expression: 'sk = :sk',
        expressionValues: {
            ':sk': {'S':'USER'}
        },
    },
};
}

export function response(ctx) {
    return ctx.result.items;
}