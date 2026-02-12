import { inject, injectable } from 'inversify';
import { createSiteSchema, uuidSchema } from '@highwood/shared';
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

  public async createSite(request: FastifyRequest) {
    logger.info({ createSite: request.body }, 'RouteHandler.siteRoute');

    const validatedSite = validate(createSiteSchema, request.body);

    const result = await this.siteProvider.createSite(validatedSite);

    return result;
  }

  public async getSiteMetrics(request: FastifyRequestToGetSite) {
    logger.info({ siteId: request.params.id }, 'SiteController.getSite');

    const siteId = validate(uuidSchema, request.params.id);

    const result = await this.siteProvider.getSiteMetrics(siteId);

    return result;
  }
}

export { SiteController };
