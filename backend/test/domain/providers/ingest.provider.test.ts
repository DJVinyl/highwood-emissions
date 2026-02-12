import { stub } from 'jest-auto-stub';

import { IngestProvider } from '../../../src/domain/providers/ingest.provider';
import { MeasurementRepository } from '../../../src/repository/measurement.repository';
import { CommandRepository } from '../../../src/repository/command.repository';
import { IngestMeasurementBulkCommand } from '../../../src/domain/commands/ingest-measurement-command';

describe('IngestProvider', () => {
  const stubMeasurementRepository = stub<MeasurementRepository>();
  const stubCommandRepository = stub<CommandRepository>();
  const provider = new IngestProvider(stubMeasurementRepository, stubCommandRepository);

  afterEach(async (): Promise<void> => {
    jest.resetAllMocks();
  });

  describe('ingestBulkMeasurements', () => {
    it('should return true when measurements is an empty array', async () => {
      const result = await provider.ingestBulkMeasurements([]);

      expect(result).toEqual(true);
    });

    it('should execute the command', async () => {
      const executeSpy = jest.spyOn(IngestMeasurementBulkCommand.prototype, 'execute').mockResolvedValue(undefined);

      const measurements = [
        {
          siteId: 'id',
          reading: 132,
          takenAt: new Date(),
        },
      ];

      const result = await provider.ingestBulkMeasurements(measurements);

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });

    it('should true when the command is executed', async () => {
      const executeSpy = jest.spyOn(IngestMeasurementBulkCommand.prototype, 'execute').mockResolvedValue(undefined);

      const measurements = [
        {
          siteId: 'id',
          reading: 132,
          takenAt: new Date(),
        },
      ];

      const result = await provider.ingestBulkMeasurements(measurements);

      expect(result).toEqual(true);
    });

    it('should false when the command is execution fails', async () => {
      const executeSpy = jest.spyOn(IngestMeasurementBulkCommand.prototype, 'execute').mockRejectedValueOnce('');

      const measurements = [
        {
          siteId: 'id',
          reading: 132,
          takenAt: new Date(),
        },
      ];

      const result = await provider.ingestBulkMeasurements(measurements);

      expect(result).toEqual(false);
    });
  });
});
