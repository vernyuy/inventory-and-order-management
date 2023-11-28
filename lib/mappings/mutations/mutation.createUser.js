import { util } from "@aws-appsync/utils";
import { put } from "@aws-appsync/utils/dynamodb";

export function request(ctx) {
  const id = util.autoId();
  const key = {
    PK: `USER#${id}`,
    SK: `USER`,
  };
  const item = { ...ctx.args.input };
  item.typeName = "User";
  item.UserItemIndexPK = `USER`;
  item.createdAt = util.time.nowEpochMilliSeconds();
  return put({
    key: key,
    item: item,
  });
}

export function response(ctx) {
  return ctx.result;
}
