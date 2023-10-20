export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  AWSDate: string;
  AWSDateTime: string;
  AWSEmail: string;
  AWSIPAddress: string;
  AWSJSON: string;
  AWSPhone: string;
  AWSTime: string;
  AWSTimestamp: number;
  AWSURL: string;
};

export type AddItemToCart = {
  item: Scalars["ID"];
  quantity: Scalars["Int"];
  unit_price: Scalars["Float"];
  userId: Scalars["ID"];
};

export type CreateInventory = {
  employeeId: Scalars["ID"];
};

export type CreateItem = {
  description?: InputMaybe<Scalars["String"]>;
  employeeId: Scalars["ID"];
  images?: InputMaybe<Scalars["String"]>;
  inventoryId: Scalars["ID"];
  name: Scalars["String"];
  price: Scalars["Float"];
  quantity_in_stock: Scalars["Int"];
};

export type CreateUser = {
  email: Scalars["String"];
  name: Scalars["String"];
};

export type Inventory = {
  __typename?: "Inventory";
  CreateOn?: Maybe<Scalars["AWSDateTime"]>;
  UpdatedOn?: Maybe<Scalars["AWSDateTime"]>;
  employee: User;
  id: Scalars["ID"];
  items: Array<Maybe<Item>>;
};

export type Item = {
  __typename?: "Item";
  CreateOn?: Maybe<Scalars["AWSDateTime"]>;
  UpdatedOn?: Maybe<Scalars["AWSDateTime"]>;
  description: Scalars["String"];
  id: Scalars["ID"];
  images?: Maybe<Scalars["String"]>;
  inventoryId: Scalars["ID"];
  name: Scalars["String"];
  price: Scalars["Float"];
  quantity_in_stock: Scalars["Int"];
};

export type Mutation = {
  __typename?: "Mutation";
  addItemToCart: Item;
  createInventory: Inventory;
  createItem?: Maybe<Item>;
  createUser?: Maybe<User>;
  placeOrder: PlaceOrder;
};

export type MutationAddItemToCartArgs = {
  input?: InputMaybe<AddItemToCart>;
};

export type MutationCreateInventoryArgs = {
  input?: InputMaybe<CreateInventory>;
};

export type MutationCreateItemArgs = {
  input: CreateItem;
};

export type MutationCreateUserArgs = {
  input: CreateUser;
};

export type MutationPlaceOrderArgs = {
  input?: InputMaybe<PlaceOrderInput>;
};

export type Order = {
  __typename?: "Order";
  CreateOn?: Maybe<Scalars["AWSDateTime"]>;
  UpdatedOn?: Maybe<Scalars["AWSDateTime"]>;
  id: Scalars["ID"];
  items?: Maybe<Array<Item>>;
  orderStatus?: Maybe<Scalars["String"]>;
  total_price?: Maybe<Scalars["Float"]>;
  total_qauntity?: Maybe<Scalars["Int"]>;
};

export type PlaceOrder = {
  __typename?: "PlaceOrder";
  CreateOn?: Maybe<Scalars["AWSDateTime"]>;
  UpdatedOn?: Maybe<Scalars["AWSDateTime"]>;
  id: Scalars["ID"];
  message?: Maybe<Scalars["String"]>;
  status?: Maybe<Scalars["String"]>;
};

export type PlaceOrderInput = {
  createAt?: InputMaybe<Scalars["AWSDateTime"]>;
  total_price?: InputMaybe<Scalars["Float"]>;
  userId: Scalars["ID"];
};

export type Query = {
  __typename?: "Query";
  getInventoryItems?: Maybe<Inventory>;
  getUserInventories?: Maybe<User>;
  getUsersInventoriesItems?: Maybe<User>;
  inventories: Array<Maybe<Inventory>>;
  inventory?: Maybe<Inventory>;
  items: Array<Maybe<Item>>;
  users: Array<Maybe<User>>;
};

export type QueryGetInventoryItemsArgs = {
  inventoryId: Scalars["ID"];
};

export type QueryGetUserInventoriesArgs = {
  id: Scalars["ID"];
};

export type QueryInventoryArgs = {
  id: Scalars["ID"];
};

export type Subscription = {
  __typename?: "Subscription";
  onCreateItem?: Maybe<Item>;
  onCreateUser?: Maybe<User>;
  onPlaceOrder?: Maybe<PlaceOrder>;
};

export enum Type {
  Admin = "ADMIN",
  Employee = "EMPLOYEE",
}

export type UpdateItem = {
  description?: InputMaybe<Scalars["String"]>;
  id: Scalars["ID"];
  name?: InputMaybe<Scalars["String"]>;
  price?: InputMaybe<Scalars["Float"]>;
  quantity?: InputMaybe<Scalars["Int"]>;
};

export type User = {
  __typename?: "User";
  CreateOn?: Maybe<Scalars["AWSDateTime"]>;
  UpdatedOn?: Maybe<Scalars["AWSDateTime"]>;
  address?: Maybe<Scalars["String"]>;
  email: Scalars["String"];
  id: Scalars["ID"];
  inventory?: Maybe<Array<Maybe<Inventory>>>;
  name: Scalars["String"];
  password: Scalars["String"];
  phone?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
};
