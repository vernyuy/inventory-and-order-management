import { util } from "@aws-appsync/utils";
import { put } from "@aws-appsync/utils/dynamodb";

export function request(ctx) {
  const key = {
    id: `USER#${ctx.args.input.userId}`,
    sk: `ITEM#${ctx.args.input.item}`,
  };

  const item = { ...ctx.args.input };
  item.cartProductStatus = "PENDING";
  item.AddedOn = util.time.nowEpochMilliSeconds();
  return put({
    key,
    item,
  });
}

export function response(ctx) {
  return ctx.result;
}
