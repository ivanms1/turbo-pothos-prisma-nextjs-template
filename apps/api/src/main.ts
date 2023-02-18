import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { json } from 'body-parser';

import { schema } from './schema';
import { Context } from './context';

const PORT = Number(process.env.PORT) || 8080;

// Add production app url here
const allowedOrigins = ['http://localhost:3000'];

const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer<Context>({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

server.start().then(async () => {
  app.use(
    '/graphql',
    cors<cors.CorsRequest>({
      origin: allowedOrigins,
    }),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({
        accessToken: req?.headers?.authorization ?? '',
      }),
    })
  );

  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(express.json({ type: 'application/json', limit: '50mb' }));
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
});
