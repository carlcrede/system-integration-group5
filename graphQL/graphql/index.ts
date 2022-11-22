import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import typeDefs from './typeDefs';
import resolvers, { pubsub } from './resolvers';
import db_connect from './db';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import express from 'express';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';

setInterval(async () => {
    await db_connect();
}, 10000);

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const httpServer = createServer(app);

// const wsServer = new WebSocketServer({
//     server: httpServer,
//     path: '/graphql',
// });

// const serverCleanup = useServer({ schema }, wsServer);

// const server = new ApolloServer({
//     schema,
//     csrfPrevention: true,
// });
httpServer.listen(3000, () => {
    console.log("server on")
})