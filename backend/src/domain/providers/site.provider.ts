import { inject, injectable } from 'inversify';

import { SiteRepository } from '../../repository/site.repository';
import { CreateSite } from '../entities/site';
import { asyncLogger as logger } from '../../lib/logger';

@injectable()
class SiteProvider {
  constructor(@inject(SiteRepository) private sitesRepository: SiteRepository) {}

  public async createSite(site: CreateSite) {
    const isCompliant = site.totalEmissionsToDate <= site.emissionLimit;

    return this.sitesRepository.insert({ ...site, isCompliant });
  }

  public async getSiteMetrics(siteId: string) {
    const site = await this.sitesRepository.findOne(siteId);

    if (!site) {
      const errorMessage = 'Site not found';

      logger.error({ siteId }, errorMessage);
      throw Error(errorMessage);
    }

    return site;
  }
}

export { SiteProvider };
