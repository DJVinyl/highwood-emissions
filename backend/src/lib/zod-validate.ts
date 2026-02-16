import { z } from 'zod';
import { asyncLogger as logger } from './logger';

export function validate<T>(schema: z.Schema<T>, value: any): T {
  const validation = schema.safeParse(value);

  if (!validation.success) {
    logger.error({ error: validation.error, success: validation.success }, 'Error occurred during Validation');
    throw validation.error;
  }

  return validation.data;
}
