import { inject, injectable } from 'inversify';
import { createSiteSchema, uuidSchema, CreateSite } from '@highwood/shared';
import { FastifyRequest } from 'fastify';

import { SiteProvider } from '../../domain/providers/site.provider';
import { asyncLogger as logger } from '../../lib/logger';
import { validate } from '../../lib/zod-validate';

interface FastifyRequestToGetSite extends FastifyRequest {
  params: {
    id: string;
  };
}

@injectable()
class SiteController {
  constructor(@inject(SiteProvider) private siteProvider: SiteProvider) {}

  public async getSites() {
    logger.info('SiteController.getSites');

    const result = await this.siteProvider.getSites();

    return result;
  }

  public async createSite(request: FastifyRequest) {
    logger.info({ createSite: request.body }, 'SiteController.createSite');

    const createSite = request.body as CreateSite;

    const validatedSite = validate(createSiteSchema, {
      name: createSite.name,
      emissionLimit: createSite.emissionLimit,
      totalEmissionsToDate: createSite.totalEmissionsToDate,
      siteType: createSite.siteType,
      coordinates: {
        latitude: createSite.coordinates.latitude,
        longitude: createSite.coordinates.longitude,
      },
    });

    const result = await this.siteProvider.createSite(validatedSite);

    return result;
  }

  public async getSiteMetrics(request: FastifyRequestToGetSite) {
    logger.info({ siteId: request.params.id }, 'SiteController.getSiteMetrics');

    const siteId = validate(uuidSchema, request.params.id);

    const result = await this.siteProvider.getSiteMetrics(siteId);

    return result;
  }
}

export { SiteController };
