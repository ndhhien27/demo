export default `
  type User{
    _id: ID!
    firstName: String!
    lastName: String!
    password: String
    email: String!
    phone: String!
    likes: [Food!]!
    orders: [Order!]
    bookmarks: [Restaurant!]
    createdRestaurants: [Restaurant!]
    location: [LocationOutput]
    favorite: [Restaurant!]
    authToken: String!
    countNotification: Int!
    isMerchant: Boolean!
  }
  
  type Query{
    users: [User!]!
    user(userId: ID!): User!
  }

  type LocationOutput {
    address: String!
    lat: Float!
    long: Float!
  }

  type AuthDataOutput{
    userId: ID!
    firstName: String!
    lastName: String!
    authToken: String!
    tokenExpiration: String
    location: [LocationOutput]!
    email: String!
    createdRestaurants: [Restaurant!]
    countNotification: Int!
    isMerchant: Boolean!
    phone: String!
  }

  type Mutation{
    createUser(userInput: UserInput!, isMerchant: Boolean!): User!
    bookmark(restaurantId: ID!, userId: ID!): User!
    login(email: String!, password: String!, fcmToken: String!, deviceId : String!, merchantApp: Boolean!): AuthDataOutput!
    addLocation(location: LocationInput!): User!
    updateUser(userId: ID!, updateUserReq: UpdateUserReq!) : User!
  }

  input UpdateUserReq {
    firstName: String
    lastName: String
    countNotification: Int
    email: String
  }

  input UserInput{
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    repassword: String!
  }

  input LocationInput{
    address: String!
    lat: Float!
    long: Float!
    userId: ID!
  }
  
`