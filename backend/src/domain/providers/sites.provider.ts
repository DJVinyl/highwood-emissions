import { inject, injectable } from 'inversify';
import { SitesRepository } from '../../repository/sites.repository';
import { Site } from '../entities/site';

@injectable()
class SitesProvider {
  constructor(@inject(SitesRepository) private sitesRepository: SitesRepository) {}

  public async createIndustrialSite(site: Site) {
    return await this.sitesRepository.createIndustrialSite(site);
  }
}

export { SitesProvider };
