import { CommandInterface } from '../../lib/command-interface';
import { CommandRepository } from '../../repository/command.repository';
import { MeasurementRepository } from '../../repository/measurement.repository';
import { CreateMeasurement } from '../entities/measurement';

class IngestMeasurementBulkCommand implements CommandInterface<CreateMeasurement[]> {
  constructor(
    private measurementRepository: MeasurementRepository,
    private commandRepository: CommandRepository,
  ) {}

  async execute(measurements: CreateMeasurement[]): Promise<void> {
    //would be tight af to call a queue.
    //alas, time constraints

    const startTime = new Date();
    const deduplicatedMap = new Map<string, CreateMeasurement>();
    const skippedIds: string[] = [];
    let lowestKey = '';
    let highestKey = '';

    for (const measurement of measurements) {
      const key = `${measurement.siteId}-${measurement.reading}-${measurement.takenAt}`;

      if (!deduplicatedMap.has(key)) {
        deduplicatedMap.set(key, measurement);

        if (!lowestKey || key < lowestKey) {
          lowestKey = key;
        }
        if (!highestKey || key > highestKey) {
          highestKey = key;
        }
      } else {
        skippedIds.push(key);
      }
    }

    const uniqueMeasurements = [...deduplicatedMap.values()];

    await this.measurementRepository.insertBulkMeasurements(uniqueMeasurements);

    const endTime = new Date();

    await this.commandRepository.insert({
      commandName: 'IngestMeasurementBulkCommand',
      startedAt: startTime,
      endedAt: endTime,
      metadata: {
        upperBound: highestKey,
        lowerBound: lowestKey,
      },
    });

    return;
  }
}
export { IngestMeasurementBulkCommand };
