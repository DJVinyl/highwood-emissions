import { pgTable, uuid, varchar, jsonb, timestamp, real, boolean, pgEnum } from 'drizzle-orm/pg-core';

const commandTable = pgTable('commands', {
  id: uuid('id').defaultRandom().primaryKey(),

  commandName: varchar('command_name', { length: 255 }).notNull(),
  metadata: jsonb('metadata').$type<Record<string, any>>(),

  startedAt: timestamp('started_at').notNull(),
  endedAt: timestamp('ended_at').notNull(),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

type CommandTable = typeof commandTable;

export { commandTable, CommandTable };
