import { util } from "@aws-appsync/utils";
import { put } from "@aws-appsync/utils/dynamodb";

export function request(ctx) {
  const id = util.autoId();
  const key = {
    id: "USER#" + id,
    sk: "USER#USER#" + id,
  };
  const item = { ...ctx.args.input };
  item.typeName = "User";
  item.GSI1PK = "USER";
  item.CreatedOn = util.time.nowEpochMilliSeconds();
  return put({
    key: key,
    item: item,
  });
}

export function response(ctx) {
  return ctx.result;
}
