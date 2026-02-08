import { pgTable, uuid, varchar, jsonb, timestamp, real } from 'drizzle-orm/pg-core';
import { Coordinate } from '../../domain/entities/site';

const sitesTable = pgTable('sites', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  siteType: varchar({ length: 256 }).notNull(),
  emissionLimit: real('emission_limit').notNull(),
  totalEmissionsToDate: real('total_emissions_to_date').default(0),
  location: jsonb('location').$type<Coordinate>(),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

type SitesTable = typeof sitesTable;

export { sitesTable, SitesTable };
