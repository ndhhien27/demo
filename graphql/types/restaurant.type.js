export default `
  type Restaurant{
    _id: ID!
    cuisines: [String!]!
    name: String!
    location: Location!
    menu_info: [DishType!]
    distance: Float
    img: String
  }

  type Query{
    restaurants: [Restaurant!]!
    restaurantByMerchant(merchantId: ID!): [Restaurant!]
    restaurantById(restaurantId: ID!): Restaurant!
    searchRestaurant(query: String!, lat: Float!, long: Float!): [Restaurant!]
    restaurantNearby(lat: Float!, long: Float!): [Restaurant!]
  }

  type Mutation{
    createRestaurant(restaurantInput: RestaurantInput!): Restaurant!
    updateRestaurantDevice(restaurantDeviceInput: RestaurantDeviceInput!): ResDiviceOutPut!
  }

  type Location{
    address: String!
    lat: Float!
    long: Float!
  }

  type ResDiviceOutPut{
    user: ID!
    restaurant: ID!
  }

  input RestaurantDeviceInput{
    restaurant: ID!
    user: ID!
    deviceId: String!
    token: String!
  }

  input FoodsInput{
    restaurant: ID
    name: String!
    price: PriceInput!
  }

  input PriceInput{
    text: String!
    unit: String!
    value: Float!
  }

  input DishTypeNameInput{
    name: String!
    foods: FoodInput
  }

  input RestaurantInput{
    name: String!
    location: RestaurantLocationInput!
    cuisines: [String!]!
    merchant: ID!
  }

  input RestaurantLocationInput{
    address: String!
    lat: Float!
    long: Float!
  }
`