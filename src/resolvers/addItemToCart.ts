import { Context } from "@aws-appsync/utils";
import { put } from "@aws-appsync/utils/dynamodb";
import { addItemToCart } from "../lib/helpers";
import { MutationAddItemToCartArgs, AddItemToCart } from "../types/appsync";

export function request(ctx: Context<MutationAddItemToCartArgs>) {
  // add timestamps
  const items = ctx.args.input;
  const item = addItemToCart(() => ctx.args.input);
  const key = {
    id: `USER#${items?.userId}`,
    sk: `ITEM#${items?.item}`,
  };

  return put({
    key,
    item,
  });
}

export function response(ctx: Context<AddItemToCart>) {
  return ctx.result;
}
