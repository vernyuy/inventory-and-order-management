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
  item.GSI1PK = "INVENTORY#" + ctx.args.input.inventoryId;
  item.GSI1SK = "ITEM#" + id;
  item.GSI2PK = "ITEM";
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
