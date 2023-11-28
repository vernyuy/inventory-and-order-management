import * as ddb from "@aws-appsync/utils/dynamodb";
export function request(ctx) {
  const { id, limit, nextToken } = ctx.args;
  let query = { PK: { eq: `USER#${id}` } };
  return ddb.query({
    query,
    limit,
    nextToken,
  });
}

export function response(ctx) {
  console.log("ITEMS:::: ", ctx.result.items);
  const items = ctx.result.items;
  const user = items.find((item) => item.typeName === "User");

  // if no user is found, return null
  if (!user) {
    console.log("could not find user in reponse items");
    return null;
  }

  const prods = {};
  // const invent_items = [];
  items.forEach((item) => {
    switch (item.typeName) {
      case "Item":
        prods[item.SK] = { ...item, id: item.sk };
        break;
      // case "Item":
      //   invent_items.push({ ...item, id: item.sk });
      //   break;
      default:
        break;
    }
  });

  // invent_items.forEach((item) =>
  //   inventories[item.inventoryId].items.push(item)
  // );
  user.items = Object.values(prods);
  console.log("USER:::: ", user);
  return user;
}
