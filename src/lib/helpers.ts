import { util } from "@aws-appsync/utils";

export type CreateItem<T> = T & {
  updatedAt: string;
  createdAt: string;
  typeName: string;
};

export type CreateUser<T> = T & {
  updatedAt: string;
  createdAt: string;
  typeName: string;
};

export type AddItemToCart<T> = T & {
  updatedAt: string;
  createdAt: string;
};

export type CreateInventory<T> = T & {
  updatedAt: string;
  createdAt: string;
  typeName: string;
};

export function createItem<T extends object>(item: T): CreateItem<T> {
  return {
    ...item,
    createdAt: util.time.nowISO8601(),
    updatedAt: util.time.nowISO8601(),
    typeName: "Item",
  };
}

export function addItemToCart<T extends object>(item: T): AddItemToCart<T> {
  return {
    ...item,
    createdAt: util.time.nowISO8601(),
    updatedAt: util.time.nowISO8601(),
  };
}

export function createUser<T extends object>(item: T): CreateUser<T> {
  return {
    ...item,
    createdAt: util.time.nowISO8601(),
    updatedAt: util.time.nowISO8601(),
    typeName: "User",
  };
}

export function createInventory<T extends object>(item: T): CreateInventory<T> {
  return {
    ...item,
    createdAt: util.time.nowISO8601(),
    updatedAt: util.time.nowISO8601(),
    typeName: "Inventory",
  };
}
