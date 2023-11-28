import { util } from "@aws-appsync/utils";
import { put } from "@aws-appsync/utils/dynamodb";
export function request(ctx) {
  const id = util.autoId();
  const key = {
    PK: ctx.args.input.userId,
    SK: "ITEM#" + id,
  };
  const item = { ...ctx.args.input };
  item.UserItemIndexPK = "ITEM";
  item.typeName = "Item";
  item.createAt = util.time.nowEpochMilliSeconds();
  item.updatedAt = util.time.nowEpochMilliSeconds();
  return put({
    key,
    item,
  });
}

export function response(ctx) {
  return ctx.result;
}
