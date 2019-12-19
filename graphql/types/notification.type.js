export default `
  type Notification{
    _id: ID!
    user: User!
    title: String!
    createdAt: String!
    updatedAt: String!
    order: Order!
    isRead: Boolean!
    message: String!
  }

  type Query{
    notificationByUser(userId: ID!): [Notification!]
    notificationByRest(restId: ID!): [Notification!]
  }

  type Mutation{
    markIsRead(notificationId: ID!): Notification!
    deleteNotification(notificationId: ID!): ID!
  }
`