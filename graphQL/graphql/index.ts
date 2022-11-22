import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import typeDefs from './typeDefs';
import resolvers, { pubsub } from './resolvers';
import db_connect from './db';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import express from 'express';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import bodyParser from 'body-parser';

setInterval(async () => {
    await db_connect();
}, 10000);

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const httpServer = createServer(app);

const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
});

const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    plugins: [
        // Proper shutdown for the HTTP server.
        ApolloServerPluginDrainHttpServer({ httpServer }),
    
        // Proper shutdown for the WebSocket server.
        {
          async serverWillStart() {
            return {
              async drainServer() {
                await serverCleanup.dispose();
              },
            };
          },
        },
      ],
});

async function start() {
    await server.start();
    await db_connect();
}
function finish() {
    app.use('/graphql', bodyParser.json(), expressMiddleware(server));
    app.get('/hello', (req,res) => {
        res.send("hello");
    });
    httpServer.listen(8080, () => {
        console.log("server on")
    });
}
start().then(() =>  finish());