import { injectable } from 'inversify';

import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { measurementTable, MeasurementsTable } from './schema/measurement.schema';
import { BaseRepository } from './base.repository';
import { CreateMeasurement, Measurement } from '../domain/entities/measurement';
import { SiteRepository } from './site.repository';
import { InferSelectModel } from 'drizzle-orm';

@injectable()
class MeasurementRepository extends BaseRepository<MeasurementsTable, Measurement> {
  constructor(
    db: NodePgDatabase,
    private siteRepository: SiteRepository,
  ) {
    super(db, measurementTable);
  }

  public async insertMeasurement(measurement: Measurement) {
    return await this.db.transaction(async (trx) => {
      await trx.insert(measurementTable).values(measurement);

      await this.siteRepository.incrementTotalEmissions(measurement.siteId, measurement.reading, trx);
    });
  }

  public async insertBulkMeasurements(measurements: CreateMeasurement[]) {
    return await this.db.transaction(async (trx) => {
      await trx.insert(measurementTable).values(measurements).onConflictDoNothing();

      const totalEmissions = measurements.reduce((accumulator, currentValue) => accumulator + currentValue.reading, 0);
      await this.siteRepository.incrementTotalEmissions(measurements[0].siteId, totalEmissions, trx);
    });
  }

  protected toDomain(row: InferSelectModel<MeasurementsTable>): Measurement {
    return {
      id: row.id,
      siteId: row.siteId,
      reading: row.reading,
      takenAt: row.takenAt,
    };
  }
}

export { MeasurementRepository };
