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
  CreateAt?: InputMaybe<Scalars["AWSDateTime"]>;
  UpdatedAt?: InputMaybe<Scalars["AWSDateTime"]>;
  address?: InputMaybe<Scalars["String"]>;
  email: Scalars["String"];
  name: Scalars["String"];
  phone?: InputMaybe<Scalars["String"]>;
  userType: Type;
};

export type Inventory = {
  __typename?: "Inventory";
  CreateAt?: Maybe<Scalars["AWSDateTime"]>;
  PK: Scalars["ID"];
  UpdatedAt?: Maybe<Scalars["AWSDateTime"]>;
  employee: User;
  items?: Maybe<Array<Maybe<Item>>>;
};

export type Item = {
  __typename?: "Item";
  CreateAt?: Maybe<Scalars["AWSDateTime"]>;
  PK: Scalars["ID"];
  UpdatedAt?: Maybe<Scalars["AWSDateTime"]>;
  description: Scalars["String"];
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
  CreateAt?: Maybe<Scalars["AWSDateTime"]>;
  PK: Scalars["ID"];
  UpdatedAt?: Maybe<Scalars["AWSDateTime"]>;
  items?: Maybe<Array<Item>>;
  orderStatus?: Maybe<Scalars["String"]>;
  total_price?: Maybe<Scalars["Float"]>;
  total_qauntity?: Maybe<Scalars["Int"]>;
};

export type PlaceOrder = {
  __typename?: "PlaceOrder";
  CreateOn?: Maybe<Scalars["AWSDateTime"]>;
  PK: Scalars["ID"];
  UpdatedOn?: Maybe<Scalars["AWSDateTime"]>;
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
  getInventories: Inventory;
  getInventory?: Maybe<Inventory>;
  getInventoryItems?: Maybe<Inventory>;
  getItems: Item;
  getUserInventories?: Maybe<User>;
  getUsers: User;
  getUsersInventoriesItems?: Maybe<User>;
};

export type QueryGetInventoryArgs = {
  id: Scalars["ID"];
};

export type QueryGetInventoryItemsArgs = {
  inventoryId: Scalars["ID"];
};

export type QueryGetUserInventoriesArgs = {
  id: Scalars["ID"];
};

export type Schema = {
  __typename?: "Schema";
  mutation?: Maybe<Mutation>;
  query?: Maybe<Query>;
};

export type Subscription = {
  __typename?: "Subscription";
  onCreateItem?: Maybe<Item>;
  onCreateUser?: Maybe<User>;
  onPlaceOrder?: Maybe<PlaceOrder>;
};

export enum Type {
  Admin = "ADMIN",
  Customer = "CUSTOMER",
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
  CreateAt?: Maybe<Scalars["AWSDateTime"]>;
  PK: Scalars["ID"];
  UpdatedAt?: Maybe<Scalars["AWSDateTime"]>;
  address?: Maybe<Scalars["String"]>;
  email: Scalars["String"];
  inventory?: Maybe<Array<Maybe<Inventory>>>;
  name: Scalars["String"];
  password?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  userType: Type;
};

export type UserResult = {
  __typename?: "UserResult";
  items: Array<User>;
  nextToken: Scalars["String"];
};
