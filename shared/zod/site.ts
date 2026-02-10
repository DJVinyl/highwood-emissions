import { z } from 'zod';

export enum SiteType {
  WELL = 'WELL',
  PROCESSING_PLANT = 'PROCESSING_PLANT',
  REFINERY = 'REFINERY',
}

//TODO: Figure out if I want to share entities or not when frontend is developed.
// Starting to think we repeat here because this is the API Layer.
// There may be calculated fields in the domain of the site but may not necessarily
// be required from an api standpoint from FE to BE
// Still need to see it action
// example is calculated field isCompliant and id...

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
