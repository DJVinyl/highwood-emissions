import { RouteOptions } from 'fastify';

import { DependencyRegistry } from './dependency-registry';
import { TestRouteController } from '../api/http/test-route-controller';
import { SitesRouteController } from '../api/http/sites-route.controller';

import { siteSchema } from '@highwood/shared';

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
      url: '/hello-world',
      handler: function (request: any, reply: any) {
        const message = dependencyRegistry.resolve(TestRouteController).helloWorld();
        return reply.status(200).send(message);
      },
    },
    {
      method: HTTP_METHOD.POST,
      url: '/v1/sites',
      handler: (request: any, reply: any) => {
        console.log('sites route', request.body);
        const validation = siteSchema.safeParse(request.body);

        if (!validation.success) {
          throw validation.error;
        }

        // const result = dependencyRegistry.resolve(SitesRouteController).createIndustrialSite(request.body);

        return reply.status(200).send();
      },
    },
    {
      method: HTTP_METHOD.POST,
      url: '/v1/ingest',
      handler: (request: any, reply: any) => {
        console.log('ingest route');
        return reply.status(200).send();
      },
    },
    {
      method: HTTP_METHOD.GET,
      url: '/v1/sites/:id/metrics',
      handler: (request: any, reply: any) => {
        console.log('sites/:id/metrics', `id: ${request.params.id}`);
        return reply.status(200).send();
      },
    },
  ];

  return routes;
};
