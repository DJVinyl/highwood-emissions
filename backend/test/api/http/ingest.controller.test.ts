import { stub } from 'jest-auto-stub';

import { IngestController } from '../../../src/api/http/ingest.controller';
import { IngestProvider } from '../../../src/domain/providers/ingest.provider';
import { FastifyRequest } from 'fastify';

describe('IngestController', () => {
  const stubIngestProvider = stub<IngestProvider>();
  const controller = new IngestController(stubIngestProvider);

  describe('ingest', () => {
    it('should call the ingestProvider.ingestBulkMeasurements', async () => {
      const measurements = [];

      await controller.ingest({
        body: measurements,
      } as FastifyRequest);

      expect(stubIngestProvider.ingestBulkMeasurements).toHaveBeenCalledTimes(1);
      expect(stubIngestProvider.ingestBulkMeasurements).toHaveBeenCalledWith(measurements);
    });
  });
});
