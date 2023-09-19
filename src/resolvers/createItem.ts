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

  // const key = {
  //   id: item.employeeId,
  //   sk: "ITEM#" + id,
  // };
  // const itemParams = {
  //   publishDate: util.time.nowISO8601(),
  //   ...item,
  //   GSI1PK: "INVENTORY#" + item.inventoryId,
  //   GSI1SK: "ITEM#" + id,
  //   GSI2PK: "ITEM",
  // };

  // return ddb.put(
  //   key,
  //   itemParams
  // )

  return {
    operation: "PutItem",
    key: {
      PK: util.dynamodb.toDynamoDB(item.employeeId),
      SK: util.dynamodb.toDynamoDB("ITEM#" + id),
    },
    attributeValues: util.dynamodb.toMapValues({
      publishDate: util.time.nowISO8601(),
      ...item,
      GSI1PK: item.inventoryId,
      GSI1SK: "ITEM#" + id,
      GSI2SK: "ITEM",
      GSI2PK: "ITEM#" + id,
    }),
  };
}

export function response(ctx: Context<Item>) {
  return ctx.result;
}
