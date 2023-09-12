export function request(ctx) {
  return { operation: "Scan" };
}

export function response(ctx) {
  return ctx.result.items;
}

// type Admin {
//     id: ID!
//     name: String!
//     email: String!
//     password: String!
//   }

//   type Employee @aws_cognito_user_pools {
//     id: ID!
//     name: String!
//     email: String!
//     password: String!
//     role: String!
//     inventory: [Inventory] @connection(name: "EmployeeInventoryId")
//   }

//   type Item @aws_api_key @aws_cognito_user_pools {
//     id: ID!
//     name: String!
//     description: String!
//     quantity: Int!
//   }

//   type ItemLine @aws_api_key @aws_cognito_user_pools {
//     id: ID!
//     itemId: ID!
//     quantity: Int!
//     price: Float!
//     order: Order @connection(name: "OrderItems")
//   }

//   type Order {
//     id: ID!
//     userId: ID!
//     itemLines: [ItemLine] @connection(name: "OrderItems")
//     totalPrice: Float!
//     status: String!
//   }

//   type Inventory @aws_cognito_user_pools(cognito_groups: ["admin", "employee"]){
//     id: ID!
//     itemId: ID!
//     quantity: Int!
//     employee: Employee! @connection(name: "EmployeeInventoryId")
//   }

//   type Query {
//     admins: [Admin]!
//       @aws_cognito_user_pools(cognito_groups: ["admin"])

//     employees: [Employee]!
//       @aws_api_key @aws_cognito_user_pools(cognito_groups: ["admin"])

//     items: [Item]!
//       @aws_api_key @aws_cognito_user_pools

//     item(id: ID!): Item
//       @aws_api_key @aws_cognito_user_pools

//     orders: [Order]!
//       @aws_api_key @aws_cognito_user_pools

//     order(id: ID!): Order
//       @aws_api_key @aws_cognito_user_pools

//     inventories: [Inventory]!
//       @aws_api_key @aws_cognito_user_pools(cognito_groups: ["admin"])

//     inventory(id: ID!): Inventory
//       @aws_api_key @aws_cognito_user_pools(cognito_groups: ["admin"])

//     itemLine: [ItemLine]!
//       @aws_api_key @aws_cognito_user_pools
//   }

//   input CreateAdmin {
//       name: String!
//        email: String!
//       password: String!
//   }

//   input CreateEmployee {
//       name: String
//       email: String
//       password: String
//       role: String
//   }

//   input CreateItem {
//       name: String!,
//       description: String!
//       price: Float!
//       quantity: Int!
//   }

//   input UpdateItem {
//       id: ID!,
//       name: String,
//       description: String,
//       price: Float,
//       quantity: Int
//   }

//   input CreateOrder {
//       totalPrice: Float
//       status: String
//       OrderItems: ID
//   }

//   input CreateItemLine {
//     quantity: Int
//     price: Float
//     orderId: ID
//     itemId: ID
//   }

//   type Mutation {
//     createAdmin(input: CreateAdmin!): Admin
//       @aws_cognito_user_pools(cognito_groups: ["admin"])

//     createEmployee(input: CreateEmployee!): Employee
//       @aws_cognito_user_pools(cognito_groups: ["admin"])

//     createItem(input: CreateItem!): Item

//     updateItem(input: UpdateItem!): Item
//       @aws_cognito_user_pools(cognito_groups: ["admin", "user"])

//     deleteItem(id: ID!): Item
//       @aws_cognito_user_pools(cognito_groups: ["admin"])

//     createOrder(input: CreateOrder!): Order

//     createItemLine(input: CreateItemLine): ItemLine

//     # updateOrder(id: ID!, userId: ID!, itemLines: [ItemLine]): Order!
//     # deleteOrder(id: ID!): Order!
//     createInventory(itemId: ID!, quantity: Int!): Inventory!
//     # updateInventory(id: ID!, itemId: ID!, quantity: Int): Inventory!
//     # deleteInventory(id: ID!): Inventory!
//   }
