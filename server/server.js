const express = require('express');
//import apollo server
const { ApolloServer } = require('apollo-server-express')

//import typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas')
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
//create new Apollo server and pass in schema data
const server = new ApolloServer({
  typeDefs,
  resolvers
})


const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//create new instance of an Apollo server with GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start()
  //integrate our Apollo server with Express application as middleware
  server.applyMiddleware({ app })

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      //log wehre we can go test our GQL API
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`)
    });
  });
}

//call async function to start server 
startApolloServer(typeDefs, resolvers)


