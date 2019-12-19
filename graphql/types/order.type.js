export default `
  type Order{
    _id: ID!
    user: User!
    items: [Item!]!
    delivery_address: String!
    restaurant: Restaurant!
    status: String!
    payment_method: String!
    createdAt: String!
    distance: Float!
    shipping_fee: Float!
  }

  type Item{
    _id: ID
    food: Food!
    qty: Int!
  }

  type Query{
    orders: [Order!]!
    ordersOfRestaurant(restaurantId: ID!): [Order!]
    ordersOfUser(userId: ID!): [Order!]
    orderById(orderId: ID!): Order!
  }

  type Mutation{
    createOrder(orderInput: OrderInput!): Order!
    updateOrder(orderId: ID!, status: String!): Order!
  }

  input ItemInput{
    qty:Int!
    food: ID!
  }

  input OrderInput{
    restaurant: ID!
    delivery_address: String!
    user: ID!
    items:[ItemInput!]!
    distance: Float!
    shipping_fee: Float!
  }
`