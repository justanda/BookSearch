import express from "express";
import db from "./config/connection.js";
import { ApolloServer } from "@apollo/server";
import path from "path";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs, resolvers } from "./schemas/index.js";
import { authenticateToken } from "./services/auth.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  await server.start();
  await db();
  const app = express();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(
    "/graphql",
    expressMiddleware(server as any, {
      context: authenticateToken as any,
    })
  );

  if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/dist"));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
    });
  }
  app.listen({ port: process.env.PORT || 3001 }, () => {
    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT || 3001}/graphql`
    );
  });
};
startServer();
