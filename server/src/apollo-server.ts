import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer, ExpressContext } from 'apollo-server-express';
import * as express from 'express';
import { Server } from 'http';
import Db from './db';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
import { addResolversToSchema } from '@graphql-tools/schema';
import { GRAPHQL_SCHEMA_PATH } from './constants';
import resolvers, { TwitterResolverContext } from './resolvers';

// top level module scope
// this is just one way to store this information, this is GraphQLFileLoader is designed for .graphql files, which this project uses
const SCHEMA = loadSchemaSync(GRAPHQL_SCHEMA_PATH, {
  loaders: [new GraphQLFileLoader()],
});

// building a function that takes in a db, that will be attached to a context and will be available anywhere we are fetching data
export async function createApolloServer(
  db: Db,
  httpServer: Server,
  app: express.Application
): Promise<ApolloServer<ExpressContext>> {
  // create a server with plug ins that uses express as a middleware
  const server = new ApolloServer({
    schema: addResolversToSchema({ schema: SCHEMA, resolvers }), // resolvers was broken out into a different module, which can also be broken down to further module
    context: (): TwitterResolverContext => ({ db }),
    // if context is an object, the object remains the same for the life of the application
    // so we use a function that returns the object so we get a new one every time, gives a per request basis clean slate
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start(); // start apollo server
  server.applyMiddleware({ app }); // installs this onto the main express app

  return server;
}
