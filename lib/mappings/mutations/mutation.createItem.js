import { util } from "@aws-appsync/utils";
import { put } from "@aws-appsync/utils/dynamodb";
export function request(ctx) {
  const id = util.autoId();
  const key = {
    PK: "USER#" + ctx.args.input.employeeId,
    SK: "ITEM#" + id,
  };
  const item = { ...ctx.args.input };
  item.typeName = "Item";
  item.UserInventoryIndexPK = "INVENTORY#" + ctx.args.input.inventoryId;
  item.UserInventoryIndexSK = "ITEM#" + id;
  item.InventoryItemIndexPK = "ITEM";
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
