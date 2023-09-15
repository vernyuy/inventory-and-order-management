import { util } from "@aws-appsync/utils";
import { put } from "@aws-appsync/utils/dynamodb";
export function request(ctx) {
  const inventoryId = util.autoId();
  const key = {
    id: "USER#" + ctx.args.input.employee,
    sk: "INVENT#" + inventoryId,
  };
  const item = { ...ctx.args.input };
  item.typeName = "Inventory";
  item.GSI1PK = "INVENTORY";
  item.GSI1SK = "INVENTORY#" + inventoryId;
  item.CreatedOn = util.time.nowEpochMilliSeconds();
  item.UpdatedOn = util.time.nowEpochMilliSeconds();
  return put({ key, item });
}

export function response(ctx) {
  return ctx.result;
}
