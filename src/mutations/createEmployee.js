import { util } from "@aws-appsync/utils";
import { put } from "@aws-appsync/utils/dynamodb";

export function request(ctx) {
  const key = {
    id: "USER",
    sk: "USER#" + util.autoId(),
  };
  const item = { ...ctx.args.input };
  item.typeName = "User";
  item.CreateOn = util.time.nowEpochMilliSeconds();
  return put({
    key: key,
    item: item,
  });
}

export function response(ctx) {
  return ctx.result;
}
