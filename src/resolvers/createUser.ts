import { Context, DynamoDBPutItemRequest, util } from "@aws-appsync/utils";
import { createItem } from "../lib/helpers";
import { MutationCreateUserArgs, User } from "../types/appsync";

export function request(
  ctx: Context<MutationCreateUserArgs>
): DynamoDBPutItemRequest {
  // add timestamps
  const user = createItem(ctx.args.input);
  const id = util.autoId();
  return {
    operation: "PutItem",
    key: {
      PK: util.dynamodb.toDynamoDB(`USER#${id}`),
      SK: util.dynamodb.toDynamoDB(`USER#${id}`),
    },
    attributeValues: util.dynamodb.toMapValues({
      publishDate: util.time.nowISO8601(),
      ...user,
      UserInventoryIndexPK: `USER`,
      UserInventoryIndexSK: `USER#${id}`,
    }),
  };
}

export function response(ctx: Context<MutationCreateUserArgs, User>) {
  console.log("CREATED USER", ctx.result);
  return ctx.result;
}
