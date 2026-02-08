import { injectable } from 'inversify';

import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { sitesTable, SitesTable } from './schema/sites.schema';
import { Site } from '../domain/entities/site';
import { BaseRepository } from './base-repository';

@injectable()
class SitesRepository extends BaseRepository<SitesTable> {
  constructor(db: NodePgDatabase) {
    super(db, sitesTable);
  }

  public async createIndustrialSite(site: Site) {
    const dataToInsert = {
      name: site.name,
      emissionLimit: site.emissionLimit,
      totalEmissionsToDate: site.totalEmissionsToDate,
      siteType: site.siteType,
      location: {
        latitude: site.coordinates.latitude,
        longitude: site.coordinates.longitude,
      },
    };

    return this.insert(dataToInsert);
  }
}

export { SitesRepository };
