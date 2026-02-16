import { injectable } from 'inversify';
import { CreateMeasurement } from '@highwood/shared';

import { MeasurementRepository } from '../../repository/measurement.repository';
import { IngestMeasurementBulkCommand } from '../commands/ingest-measurement-command';
import { CommandRepository } from '../../repository/command.repository';
import { asyncLogger as logger } from '../../lib/logger';

@injectable()
class IngestProvider {
  constructor(
    private measurementRepository: MeasurementRepository,
    private commandRepository: CommandRepository,
  ) {}

  public async ingestBulkMeasurements(measurements: CreateMeasurement[]): Promise<boolean> {
    logger.info({ measurements }, 'IngestProvider.ingestBulkMeasurements');

    if (!measurements || measurements.length === 0) {
      return true;
    }

    try {
      const command = new IngestMeasurementBulkCommand(this.measurementRepository, this.commandRepository);

      await command.execute(measurements);
    } catch (error) {
      logger.error({ error }, 'error occurred while executing IngestMeasurementBulkCommand');

      return false;
    }

    return true;
  }
}

export { IngestProvider };
