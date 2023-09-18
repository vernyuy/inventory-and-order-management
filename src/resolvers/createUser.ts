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
      GSI1PK: "USER",
    }),
  };
}

export function response(ctx: Context<User>) {
  return ctx.result;
}
