import { pgTable, uuid, varchar, jsonb, timestamp, real, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { Coordinate, SiteType } from '../../domain/entities/site';
import { enumToPgEnum } from '../../lib/enum-to-pg-enum';

const siteType = pgEnum('site_type', enumToPgEnum(SiteType));

const sitesTable = pgTable('sites', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  siteType: siteType('site_type').notNull(),
  emissionLimit: real('emission_limit').notNull(),
  totalEmissionsToDate: real('total_emissions_to_date').default(0),
  location: jsonb('location').$type<Coordinate>(),
  isCompliant: boolean('is_compliant').default(true),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

type SitesTable = typeof sitesTable;

export { sitesTable, SitesTable };
