import { pgTable, uuid, jsonb, timestamp, varchar, pgEnum } from 'drizzle-orm/pg-core';
import { enumToPgEnum } from '../../lib/enum-to-pg-enum';

export enum OutboxStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
}

const statusPgEnum = pgEnum('outbox_status', enumToPgEnum(OutboxStatus));

const outboxTable = pgTable('outbox', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventType: varchar({ length: 255 }).notNull(),
  payload: jsonb('payload'),
  status: statusPgEnum('status').notNull().default(OutboxStatus.PENDING),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

type OutboxTable = typeof outboxTable;

export { outboxTable, OutboxTable };
