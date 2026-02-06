import { v4 as uuid } from 'uuid';
import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { DependencyRegistry } from './configuration/dependency-registry';
import { getRoutes } from './configuration/routes';
import 'dotenv/config';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

const createApp = async (
  dependencyRegistry: DependencyRegistry,
  database: NodePgDatabase,
): Promise<FastifyInstance> => {
  const app: FastifyInstance = fastify({
    requestIdHeader: 'x-request-id',
    genReqId: () => uuid(),
  });

  app.register(cors, {
    origin: '*',
    allowedHeaders: ['Origin', 'X-Requested-With', 'Accept', 'Content-Type', 'Authorization'],
    methods: ['GET', 'PUT', 'OPTIONS', 'POST', 'DELETE'],
  });

  app.decorate('db', database);

  const routes = getRoutes(dependencyRegistry);

  for (const route of routes) {
    app.route(route);
  }

  await app.ready();

  return app;
};

export default createApp;
