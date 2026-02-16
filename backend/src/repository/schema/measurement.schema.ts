import { pgTable, uuid, timestamp, real, index } from 'drizzle-orm/pg-core';
import { sitesTable } from './site.schema';

const measurementTable = pgTable(
  'measurements',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    siteId: uuid('site_id')
      .notNull()
      .references(() => sitesTable.id),
    reading: real('reading').notNull(),
    takenAt: timestamp('taken_at').notNull(),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [index('site_id_idx').on(table.siteId)],
);

type MeasurementsTable = typeof measurementTable;

export { measurementTable, MeasurementsTable };
