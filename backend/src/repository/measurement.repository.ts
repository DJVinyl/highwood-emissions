import { injectable } from 'inversify';
import { InferSelectModel } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { CreateMeasurement, Measurement } from '@highwood/shared';

import { BaseRepository } from './base.repository';
import { SiteRepository } from './site.repository';
import { ErrorCode, HighwoodError } from '../lib/highwood-error';
import { measurementTable, MeasurementsTable } from './schema/measurement.schema';

@injectable()
class MeasurementRepository extends BaseRepository<MeasurementsTable, Measurement> {
  constructor(
    db: NodePgDatabase,
    private siteRepository: SiteRepository,
  ) {
    super(db, measurementTable);
  }

  public async getAllMeasurementsForSite(siteId: string) {
    const measurements = await this.findAll({
      siteId,
    });

    return measurements ? measurements : [];
  }

  public async insertMeasurement(measurement: Measurement) {
    try {
      return await this.db.transaction(async (trx) => {
        await trx.insert(measurementTable).values(measurement);

        await this.siteRepository.incrementTotalEmissions(measurement.siteId, measurement.reading, trx);
      });
    } catch (error) {
      throw new HighwoodError(ErrorCode.DATABASE_ERROR, 'Error inserting Bulk measurements', error);
    }
  }

  public async insertBulkMeasurements(measurements: CreateMeasurement[]) {
    try {
      return await this.db.transaction(async (trx) => {
        await trx.insert(measurementTable).values(measurements).onConflictDoNothing();

        const totalEmissions = measurements.reduce(
          (accumulator, currentValue) => accumulator + currentValue.reading,
          0,
        );
        await this.siteRepository.incrementTotalEmissions(measurements[0].siteId, totalEmissions, trx);
      });
    } catch (error) {
      throw new HighwoodError(ErrorCode.DATABASE_ERROR, 'Error inserting Bulk measurements', error);
    }
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
