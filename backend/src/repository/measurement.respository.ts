import { injectable } from 'inversify';

import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { measurementTable, MeasurementsTable } from './schema/measurement.schema';
import { BaseRepository } from './base.repository';
import { Measurement } from '../domain/entities/measurement';
import { SiteRepository } from './site.repository';

@injectable()
class MeasurementRepository extends BaseRepository<MeasurementsTable> {
  constructor(
    db: NodePgDatabase,
    private siteRepository: SiteRepository,
  ) {
    super(db, measurementTable);
  }

  public async insertBulkMeasurementsForOneSite(measurements: Measurement[]) {
    return await this.db.transaction(async (trx) => {
      await trx.insert(measurementTable).values(measurements).returning();

      const totalEmissions = measurements.reduce((accumulator, currentValue) => accumulator + currentValue.reading, 0);
      await this.siteRepository.incrementTotalEmissions(measurements[0].siteId, totalEmissions, trx);
    });
  }
}

export { MeasurementRepository };
