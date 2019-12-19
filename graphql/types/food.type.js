export default `
  type Food{
    _id: ID!
    name: String!
    img_uri: String!
    total_order: Int!
    restaurant: Restaurant!
    dish_type: DishType!
    is_available: Boolean!
    createdAt: String!
    updatedAt: String!
    price: Float!
  }

  type Query{
    foodsByRestaurant(restaurantId: ID!): [Food!]!
  }

  type Mutation{
    createFood(foodInput: FoodInput!): [Food!]!
    changeFoodAvailable(isAvailable: Boolean!, foodId: ID!): ID!
  }

  input DetailInput{
    name: String!
    price: Float!
  }

  input FoodInput{
    restaurant: ID!
    detail: [DetailInput!]!
    dishType: ID!
  }
`