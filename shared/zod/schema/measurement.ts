import z from 'zod';
import { createMeasurementSchema, measurementSchema } from '../schema';

export type Measurement = z.infer<typeof measurementSchema>;
export type CreateMeasurement = z.infer<typeof createMeasurementSchema>;
