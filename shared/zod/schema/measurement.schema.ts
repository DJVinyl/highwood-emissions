import { z } from 'zod';

export const measurementSchema = z.object({
  id: z.uuid(),
  siteId: z.string(),
  reading: z.number(),
  takenAt: z.date(),
});

export const createMeasurementSchema = measurementSchema.omit({ id: true });
export const measurementsArraySchema = z.array(createMeasurementSchema);
