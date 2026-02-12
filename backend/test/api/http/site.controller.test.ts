import { stub } from 'jest-auto-stub';
import { FastifyRequest } from 'fastify';

import { SiteProvider } from '../../../src/domain/providers/site.provider';
import { SiteController } from '../../../src/api/http/site.controller';
import { SiteType } from '../../../src/domain/entities/site';
import { randomUUID } from 'crypto';

describe('SiteController', () => {
  const stubSiteProvider = stub<SiteProvider>();
  const controller = new SiteController(stubSiteProvider);

  describe('createSite', () => {
    it('should call the siteProvider.createSite when site has the correct shape', async () => {
      const createSite = {
        name: 'I should use fishery+faker',
        emissionLimit: 321,
        totalEmissionsToDate: 3,
        siteType: SiteType.WELL,
        coordinates: {
          latitude: 10,
          longitude: 15,
        },
      };

      await controller.createSite({ body: createSite } as FastifyRequest);

      expect(stubSiteProvider.createSite).toHaveBeenCalledTimes(1);
      expect(stubSiteProvider.createSite).toHaveBeenCalledWith(createSite);
    });

    it('should throw a ZodError when given invalid shape', async () => {
      try {
        const site = {
          name: 'foo',
        };
        await controller.createSite({ body: site } as FastifyRequest);
      } catch (error) {
        expect(error.constructor.name).toEqual('ZodError');
      }
    });
  });

  describe('getSiteMetrics', () => {
    it('should call the siteProvider.getSiteMetrics', async () => {
      const siteId = randomUUID();

      await controller.getSiteMetrics({ params: { id: siteId } } as never);

      expect(stubSiteProvider.getSiteMetrics).toHaveBeenCalledTimes(1);
      expect(stubSiteProvider.getSiteMetrics).toHaveBeenCalledWith(siteId);
    });

    it('should throw a ZodError when given invalid shape', async () => {
      try {
        const siteId = 'asddsa';

        await controller.getSiteMetrics({ params: { id: siteId } } as never);
      } catch (error) {
        expect(error.constructor.name).toEqual('ZodError');
      }
    });
  });
});
