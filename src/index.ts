import express from "express";
import { ApolloServer, makeExecutableSchema } from "apollo-server-express";

import { schema as typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { getConnection, getUserId } from "./database/index";

const name = "kevin";

const app = express();
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const apolloServer = new ApolloServer({
  schema,
  context: async () => {
    const dbConn = await getConnection();
    const userId = await getUserId(dbConn, name);
    return { userId, dbConn };
  },
});

apolloServer.applyMiddleware({ app, path: "/graphql" });

app.listen({ port: 8000 }, () => {
  console.log("Apollo Server on http://localhost:8000/graphql");
});
