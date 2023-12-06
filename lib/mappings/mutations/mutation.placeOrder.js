import { util } from "@aws-appsync/utils";
import { put } from "@aws-appsync/utils/dynamodb";

export function request(ctx) {
  const id = util.autoId();
  const key = {
    PK: ctx.args.input.userId,
    SK: "ORDER#" + id,
  };
  const item = { ...ctx.args.input };
  item.orderStatus = "PENDING";
  item.orderItems = [];
  item.total_items = 0;
  item.GSI1PK = "ORDER";
  item.GSI1SK = "ORDER#" + id,
  item.createdAt = util.time.nowEpochMilliSeconds();
  item.updatedAt = util.time.nowEpochMilliSeconds();
  return put({
    key: key,
    item: item,
  });
}

export function response(ctx) {
  const id = ctx.result.PK;
  const message = `Make your payment here: https://buy.stripe.com/test_7sI02B9T5gYlaME28j`;
  const status = "Processing";
  return {
    id: id,
    message,
    status,
  };
}
