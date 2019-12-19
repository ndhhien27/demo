require('dotenv').config()
const express = require('express')
import { urlencoded, json } from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import verify from './middlewares/verify'

import { ApolloServer } from 'apollo-server-express'
import schema from './graphql/'

const app = express();
const server = new ApolloServer({
  schema,
  context: ({ req }) => ({ ...req })
});

app.use(urlencoded({ extended: false }))

app.use(json())

app.use(cors());
app.use(verify);

server.applyMiddleware({ app, path: '/graphql' });

mongoose.connect(process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
)
  .then(() =>
    app.listen(1808, () =>
      console.log(`Server ready at http://localhost:1808${server.graphqlPath}`)))
  .catch(err => console.log(err))

// app.listen(5000, () => console.log('Server is listening'));