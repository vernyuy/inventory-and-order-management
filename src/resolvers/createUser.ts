import { Context, DynamoDBPutItemRequest, util } from "@aws-appsync/utils";
import { createItem } from "../lib/helpers";
import { MutationCreateUserArgs, User } from "../types/appsync";
import { put } from "@aws-appsync/utils/dynamodb";

export function request(
  ctx: Context<MutationCreateUserArgs>
): DynamoDBPutItemRequest {
  // add timestamps
  const user = createItem(ctx.args.input);
  const id = util.autoId();

  // const key = {
  //   PK: `USER#${id}`,
  //   SK: `USER#${id}`,
  // };
  // const item = { ...user };
  // item.typeName = "Inventory";
  // item.GSI2PK = "INVENTORY";
  // item.GSI1SK = "INVENTORY#" + inventoryId;
  // item.GSI1PK = "INVENTORY#" + inventoryId;
  // item.CreatedOn = util.time.nowEpochMilliSeconds();
  // item.UpdatedOn = util.time.nowEpochMilliSeconds();

  // return put({
  //   key,
  //   item: {...user},
  // });
  return {
    operation: "PutItem",
    key: {
      PK: util.dynamodb.toDynamoDB(`USER#${id}`),
      SK: util.dynamodb.toDynamoDB(`USER#${id}`),
    },
    attributeValues: util.dynamodb.toMapValues({
      publishDate: util.time.nowISO8601(),
      ...user,
      GSI1PK: `USER`,
      GSI1SK: `USER#${id}`,
    }),
  };
}

export function response(ctx: Context<MutationCreateUserArgs, User>) {
  console.log("CREATED USER", ctx.result);
  return ctx.result;
}
