import { injectable } from 'inversify';
import { eq, InferSelectModel, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Site } from '@highwood/shared';

import { sitesTable, SitesTable } from './schema/site.schema';
import { BaseRepository } from './base.repository';

@injectable()
class SiteRepository extends BaseRepository<SitesTable, Site> {
  constructor(db: NodePgDatabase) {
    super(db, sitesTable);
  }

  public async incrementTotalEmissions(siteId: string, amount: number, trx: NodePgDatabase) {
    return await trx
      .update(sitesTable)
      .set({
        totalEmissionsToDate: sql`${sitesTable.totalEmissionsToDate} + ${amount}`,
      })
      .where(eq(sitesTable.id, siteId));
  }

  protected toDomain(row: InferSelectModel<SitesTable>): Site {
    return {
      id: row.id,
      name: row.name,
      emissionLimit: row.emissionLimit,
      totalEmissionsToDate: row.totalEmissionsToDate,
      siteType: row.siteType,
      coordinates: row.coordinates,
      isCompliant: row.isCompliant,
    };
  }
}

export { SiteRepository };
