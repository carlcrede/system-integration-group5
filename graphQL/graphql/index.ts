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
import handler from 'azure-function-express';

// TODO: the problem is that we need a WS server to run the subscriptions, however, the WS server cannot presumably be there as
// we use the apollo-server-azure-functions and not the classic server and we therefore cannot have an express middleware and all the
// other necessary things needed there, as in the article: https://www.apollographql.com/docs/apollo-server/data/subscriptions/ 
// come back later to this if time

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
});


async function startIt() {
    await server.start();
}
startIt().then(() => {
    app.use('/graphql', expressMiddleware(server));
    const PORT = 80;
    httpServer.listen(PORT, () => {
    });
});
export default handler.createHandler(httpServer);