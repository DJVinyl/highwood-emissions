import { injectable } from 'inversify';
import { FastifyRequest } from 'fastify';
import { measurementsArraySchema } from '@highwood/shared';

import { asyncLogger as logger } from '../../lib/logger';
import { IngestProvider } from '../../domain/providers/ingest.provider';
import { validate } from '../../lib/zod-validate';

@injectable()
export class IngestController {
  constructor(private ingestProvider: IngestProvider) {}

  public async ingest(request: FastifyRequest) {
    logger.info({ measurements: request.body }, 'IngestController.ingest');

    const measurements = validate(measurementsArraySchema, request.body);

    return this.ingestProvider.ingestBulkMeasurements(measurements);
  }
}
