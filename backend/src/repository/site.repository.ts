import { injectable } from 'inversify';
import { eq, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { sitesTable, SitesTable } from './schema/site.schema';
import { Site } from '../domain/entities/site';
import { BaseRepository } from './base.repository';

@injectable()
class SiteRepository extends BaseRepository<SitesTable> {
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
      isCompliant: site.isCompliant,
    };

    return this.insert(dataToInsert);
  }

  public async incrementTotalEmissions(siteId: string, amount: number, trx: NodePgDatabase) {
    return await trx
      .update(sitesTable)
      .set({
        totalEmissionsToDate: sql`${sitesTable.totalEmissionsToDate} + ${amount}`,
      })
      .where(eq(sitesTable.id, siteId));
  }
}

export { SiteRepository };
