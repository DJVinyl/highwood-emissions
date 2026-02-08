import { z } from 'zod';

//TODO: Figure out if I want to share entities or not when frontend is developed.
export enum SiteType {
  WELL = 'WELL',
  PROCESSING_PLANT = 'PROCESSING_PLANT',
  REFINERY = 'REFINERY',
}

export const siteSchema = z.object({
  name: z.string(),
  emissionLimit: z.number(),
  totalEmissionsToDate: z.number(),
  siteType: z.nativeEnum(SiteType),
  coordinates: z.object({
    latitude: z.number(), // Can potentially add ranges
    longitude: z.number(), // Can potentially add ranges
  }),
});

//TODO: Figure out if I to use this as entities vs. domain entities vs. share entities
export type Site = z.infer<typeof siteSchema>;
