import { inject, injectable } from 'inversify';
import { FastifyRequest } from 'fastify';

import { SitesProvider } from '../../domain/providers/sites.provider';
import { Site } from '../../domain/entities/site';

//Have to do ZOD here for validation
type CreateIndustrialSiteRequest = FastifyRequest & {
  body: {
    site: Site;
  };
};

@injectable()
class SitesRouteController {
  constructor(@inject(SitesProvider) private sitesProvider: SitesProvider) {}

  public async createIndustrialSite(request: CreateIndustrialSiteRequest) {
    //ZOD this.
    const site = request.body.site;

    await this.sitesProvider.createIndustrialSite(site);
  }
}

export { SitesRouteController };
