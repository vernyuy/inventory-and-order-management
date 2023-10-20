import { Context, DynamoDBPutItemRequest, util } from "@aws-appsync/utils";
import { createItem } from "../lib/helpers";
import { MutationCreateItemArgs, Item } from "../types/appsync";
import * as ddb from "@aws-appsync/utils/dynamodb";
export function request(
  ctx: Context<MutationCreateItemArgs>
): DynamoDBPutItemRequest {
  // add timestamps
  const item = createItem(ctx.args.input);

  const id = util.autoId();

  return {
    operation: "PutItem",
    key: {
      PK: util.dynamodb.toDynamoDB(item.employeeId),
      SK: util.dynamodb.toDynamoDB("ITEM#" + id),
    },
    attributeValues: util.dynamodb.toMapValues({
      publishDate: util.time.nowISO8601(),
      ...item,
      UserInventoryIndexPK: item.inventoryId,
      UserInventoryIndexSK: `ITEM${id}`,
      InventoryItemIndexSK: "ITEM",
      InventoryItemIndexPK: `ITEM${id}`,
    }),
  };
}

export function response(ctx: Context<Item>) {
  return ctx.result;
}
