import { inject, injectable } from 'inversify';
import { SiteRepository } from '../../repository/site.repository';
import { Site } from '../entities/site';

@injectable()
class SiteProvider {
  constructor(@inject(SiteRepository) private sitesRepository: SiteRepository) {}

  public async createIndustrialSite(site: Site) {
    const isCompliant = site.totalEmissionsToDate <= site.emissionLimit;

    return this.sitesRepository.createIndustrialSite({ ...site, isCompliant });
  }
}

export { SiteProvider };
