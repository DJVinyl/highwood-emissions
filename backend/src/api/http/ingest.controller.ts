import { injectable } from 'inversify';
import { FastifyRequest } from 'fastify';
import { Measurement, measurementsArraySchema } from '@highwood/shared';

import { asyncLogger as logger } from '../../lib/logger';
import { IngestProvider } from '../../domain/providers/ingest.provider';
import { validate } from '../../lib/zod-validate';

@injectable()
export class IngestController {
  constructor(private ingestProvider: IngestProvider) {}

  public async ingest(request: FastifyRequest) {
    logger.info({ measurements: request.body }, 'IngestController.ingest');
    logger.info({ date: new Date() }, 'time');
    return false;

    const measurementsWithDates = (request.body as Measurement[]).map((measurement) => {
      return {
        reading: measurement.reading,
        takenAt: new Date(measurement.takenAt),
        siteId: measurement.siteId,
      };
    });

    const measurements = validate(measurementsArraySchema, measurementsWithDates);

    return this.ingestProvider.ingestBulkMeasurements(measurements);
  }
}
