import { z } from 'zod';

export function validate<T>(schema: z.Schema<T>, value: any): T {
  const validation = schema.safeParse(value);

  if (!validation.success) {
    throw validation.error;
  }

  return validation.data;
}
