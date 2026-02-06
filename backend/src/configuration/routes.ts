import { RouteOptions } from 'fastify';
import { DependencyRegistry } from './dependency-registry';
import { TestRouteController } from '../api/http/test-route-controller';

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
  ];

  return routes;
};
