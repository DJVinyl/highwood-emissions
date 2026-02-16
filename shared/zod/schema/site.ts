import z from 'zod';
import { coordinateSchema, createSiteSchema, siteSchema } from './site.schema';

export type Site = z.infer<typeof siteSchema>;
export type CreateSite = z.infer<typeof createSiteSchema>;
export type Coordinate = z.infer<typeof coordinateSchema>;

export enum SiteType {
  WELL = 'WELL',
  PROCESSING_PLANT = 'PROCESSING_PLANT',
  REFINERY = 'REFINERY',
}
