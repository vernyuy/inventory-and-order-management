import { util } from "@aws-appsync/utils";
import { put } from "@aws-appsync/utils/dynamodb";

export function request(ctx) {
  const key = {
    id: ctx.args.input.user,
    sk: "ORDER#" + util.autoId(),
  };
  const item = { ...ctx.args.input };
  item.orderStatus = "PENDING";
  item.orderItems = [];
  item.total_items = 0;
  item.CreatedOn = util.time.nowEpochMilliSeconds();
  item.UpdatedOn = util.time.nowEpochMilliSeconds();
  return put({
    key: key,
    item: item,
  });
}

export function response(ctx) {
  const id = ctx.result.id;
  const message = `Order ${id} placed successfully. You will recieve an email when order is completed`;
  const status = "Processing";
  return {
    id,
    message,
    status,
  };
}
