export function request() {
    return {
      operation: 'Scan',
      filter: {
          expression: 'begins_with(sk, :sk)',
          expressionValues: {
              ':sk': {'S':'ITEM#'}
          },
      },
  };
  }
  
  export function response(ctx) {
      return ctx.result.items;
  }