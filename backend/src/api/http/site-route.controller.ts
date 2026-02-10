import { inject, injectable } from 'inversify';

import { SiteProvider } from '../../domain/providers/site.provider';
import { Site } from '../../domain/entities/site';

@injectable()
class SiteRouteController {
  constructor(@inject(SiteProvider) private siteProvider: SiteProvider) {}

  public async createIndustrialSite(site: Site) {
    return this.siteProvider.createIndustrialSite(site);
  }
}

export { SiteRouteController };
