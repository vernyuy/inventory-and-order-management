import { util } from "@aws-appsync/utils";
import { put } from "@aws-appsync/utils/dynamodb";
export function request(ctx) {
  const key = {
    id: ctx.args.input.employeeId,
    sk: "ITEM#" + util.autoId(),
    GSKI1PK: "INVENTORY",
    GSKI1SK: "ITEM#" + util.autoId(),
  };
  const item = { ...ctx.args.input };
  item.typeName = "Item";
  item.AddedOn = util.time.nowEpochMilliSeconds();
  item.UpdatedOn = util.time.nowEpochMilliSeconds();
  return put({
    key,
    item,
  });
}

export function response(ctx) {
  return ctx.result;
}
