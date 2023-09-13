import { util } from "@aws-appsync/utils";
import { put } from "@aws-appsync/utils/dynamodb";
export function request(ctx) {
  const key = {
    id: ctx.args.input.employee,
    sk: "INVENT#" + util.autoId(),
  };
  const item = { ...ctx.args.input };
  item.typeName = "Inventory";
  item.CreatedOn = util.time.nowEpochMilliSeconds();
  item.UpdatedOn = util.time.nowEpochMilliSeconds();

  return put({ key, item });
}

export function response(ctx) {
  return ctx.result;
}
