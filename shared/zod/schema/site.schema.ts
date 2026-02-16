import { z } from 'zod';
import { SiteType } from './site';

export const coordinateSchema = z.object({
  latitude: z.number(), // Can potentially add ranges
  longitude: z.number(), // Can potentially add ranges
});

export const siteSchema = z.object({
  id: z.string(),
  name: z.string(),
  emissionLimit: z.number(),
  totalEmissionsToDate: z.number(),
  siteType: z.enum(SiteType),
  coordinates: coordinateSchema,
  isCompliant: z.boolean(),
});

export const createSiteSchema = siteSchema.omit({ id: true, isCompliant: true });
