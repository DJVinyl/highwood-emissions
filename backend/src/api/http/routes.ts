import { RouteOptions } from 'fastify';

import { DependencyRegistry } from '../../configuration/dependency-registry';
import { SiteController } from './site.controller';
import { IngestController } from './ingest.controller';

enum HTTP_METHOD {
  GET = 'GET',
  POST = 'POST',
}

export const getRoutes = (dependencyRegistry: DependencyRegistry): RouteOptions[] => {
  const routes = [
    {
      method: HTTP_METHOD.GET,
      url: '/',
      handler: function (request: any, reply: any) {
        return reply.status(200).send(200);
      },
    },
    {
      method: HTTP_METHOD.GET,
      url: '/v1/sites',
      handler: async (request: any, reply: any) => {
        const result = await dependencyRegistry.resolve(SiteController).getSites();

        return reply.status(200).send(result);
      },
    },
    {
      method: HTTP_METHOD.POST,
      url: '/v1/sites',
      handler: async (request: any, reply: any) => {
        const result = await dependencyRegistry.resolve(SiteController).createSite(request);

        return reply.status(200).send(result);
      },
    },
    {
      method: HTTP_METHOD.POST,
      url: '/v1/ingest',
      handler: async (request: any, reply: any) => {
        const result = await dependencyRegistry.resolve(IngestController).ingest(request);

        return reply.status(200).send(result);
      },
    },
    {
      method: HTTP_METHOD.GET,
      url: '/v1/sites/:id/metrics',
      handler: async (request: any, reply: any) => {
        const result = await dependencyRegistry.resolve(SiteController).getSiteMetrics(request);

        return reply.status(200).send(result);
      },
    },
  ];

  return routes;
};
