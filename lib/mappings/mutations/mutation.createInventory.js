import { util } from "@aws-appsync/utils";
import { put } from "@aws-appsync/utils/dynamodb";
export function request(ctx) {
  const inventoryId = util.autoId();
  const key = {
    PK: ctx.args.input.employeeId,
    SK: "INVENTORY#" + inventoryId,
  };
  const item = { ...ctx.args.input };
  item.typeName = "Inventory";
  item.UserInventoryIndexSK = "INVENTORY#" + inventoryId;
  item.UserInventoryIndexPK = "INVENTORY#" + inventoryId;
  item.InventoryItemIndexPK = "INVENTORY";
  item.InventoryItemIndexSK = "INVENTORY#" + inventoryId;
  item.CreatedOn = util.time.nowEpochMilliSeconds();
  item.UpdatedOn = util.time.nowEpochMilliSeconds();
  return put({ key, item });
}

export function response(ctx) {
  return ctx.result;
}
