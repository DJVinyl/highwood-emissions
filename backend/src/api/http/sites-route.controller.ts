import { inject, injectable } from 'inversify';

import { SitesProvider } from '../../domain/providers/sites.provider';
import { Site } from '../../domain/entities/site';

@injectable()
class SitesRouteController {
  constructor(@inject(SitesProvider) private sitesProvider: SitesProvider) {}

  public async createIndustrialSite(site: Site) {
    return this.sitesProvider.createIndustrialSite(site);
  }
}

export { SitesRouteController };
