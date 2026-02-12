import 'dotenv/config';
import { v4 as uuid } from 'uuid';
import fastify, { FastifyError, FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { ZodError } from 'zod';

import { DependencyRegistry } from './configuration/dependency-registry';
import { getRoutes } from './api/http/routes';

export function isZodError(error: any): error is ZodError {
  return error instanceof ZodError || error.name === 'ZodError';
}

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

  app.setErrorHandler((error: FastifyError, request, reply) => {
    if (isZodError(error)) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation Error',
        issues: error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
          code: issue.code,
        })),
      });
    }

    return reply.status(error.statusCode || 500).send({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal Server Error',
    });
  });

  const routes = getRoutes(dependencyRegistry);
  for (const route of routes) {
    app.route(route);
  }

  await app.ready();

  return app;
};

export default createApp;
