import { Context, DynamoDBPutItemRequest, util } from "@aws-appsync/utils";
import { createItem } from "../lib/helpers";
import { MutationCreateItemArgs, Item } from "../types/appsync";

export function request(
  ctx: Context<MutationCreateItemArgs>
): DynamoDBPutItemRequest {
  // add timestamps
  const item = createItem(ctx.args.input);

  const id = util.autoId();

  return {
    operation: "PutItem",
    key: {
      id: util.dynamodb.toDynamoDB(item.employeeId),
      sk: "ITEM#" + id,
    },
    attributeValues: util.dynamodb.toMapValues({
      publishDate: util.time.nowISO8601(),
      ...item,
      GSI1PK: "INVENTORY#" + item.inventoryId,
      GSI1SK: "ITEM#" + id,
      GSI2PK: "ITEM",
    }),
  };
}

export function response(ctx: Context<Item>) {
  return ctx.result;
}
