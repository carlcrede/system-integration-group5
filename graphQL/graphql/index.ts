import { ApolloServer } from 'apollo-server-azure-functions';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import typeDefs from './typeDefs';
import resolvers, { pubsub } from './resolvers';
import db_connect from './db';
// TODO: the problem is that we need a WS server to run the subscriptions, however, the WS server cannot presumably be there as
// we use the apollo-server-azure-functions and not the classic server and we therefore cannot have an express middleware and all the
// other necessary things needed there, as in the article: https://www.apollographql.com/docs/apollo-server/data/subscriptions/ 
// come back later to this if time

setInterval(async () => {
    await db_connect();
}, 10000);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
        ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
    context: () => ({pubsub})
});

export default server.createHandler({
    cors: {
        origin: '*'
    },
});