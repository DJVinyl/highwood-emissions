import { stub } from 'jest-auto-stub';

import { IngestMeasurementBulkCommand } from '../../../src/domain/commands/ingest-measurement-command';
import { MeasurementRepository } from '../../../src/repository/measurement.repository';
import { CommandRepository } from '../../../src/repository/command.repository';

describe('IngestMeasurementBulkCommand', () => {
  const stubMeasurementRepository = stub<MeasurementRepository>();
  const stubCommandRepository = stub<CommandRepository>();

  const command = new IngestMeasurementBulkCommand(stubMeasurementRepository, stubCommandRepository);

  afterEach(() => jest.resetAllMocks());

  describe('execute', () => {
    it('should call the measurementRepository.insertBulkMeasurements', async () => {
      const measurements = [
        {
          siteId: 'id',
          reading: 132,
          takenAt: new Date(),
        },
      ];
      await command.execute(measurements);

      expect(stubMeasurementRepository.insertBulkMeasurements).toHaveBeenCalledTimes(1);
      expect(stubMeasurementRepository.insertBulkMeasurements).toHaveBeenCalledWith(measurements);
    });

    it('should call the commandRepository.insert', async () => {
      const measurements = [
        {
          siteId: 'id',
          reading: 132,
          takenAt: new Date(),
        },
      ];
      await command.execute(measurements);

      expect(stubCommandRepository.insert).toHaveBeenCalledTimes(1);
      expect(stubCommandRepository.insert).toHaveBeenCalledWith({
        commandName: 'IngestMeasurementBulkCommand',
        startedAt: expect.any(Date),
        endedAt: expect.any(Date),
        metadata: {
          upperBound: `${measurements[0].siteId}-${measurements[0].reading}-${measurements[0].takenAt}`,
          lowerBound: `${measurements[0].siteId}-${measurements[0].reading}-${measurements[0].takenAt}`,
        },
      });
    });

    it('should deduplicate exact same entries', async () => {
      const date = new Date();
      const measurements = [
        {
          siteId: 'id',
          reading: 132,
          takenAt: date,
        },
        {
          siteId: 'id',
          reading: 132,
          takenAt: date,
        },
      ];
      await command.execute(measurements);

      expect(stubMeasurementRepository.insertBulkMeasurements).toHaveBeenCalledTimes(1);
      expect(stubMeasurementRepository.insertBulkMeasurements).toHaveBeenCalledWith([measurements[0]]);
    });
  });
});
