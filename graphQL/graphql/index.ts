import { ApolloServer } from 'apollo-server-azure-functions';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import typeDefs from './typeDefs';
import resolvers from './resolvers';
import db_connect from './db';

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
});

export default server.createHandler({
    cors: {
        origin: '*'
    },
});