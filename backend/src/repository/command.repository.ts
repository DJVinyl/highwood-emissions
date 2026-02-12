import { injectable } from 'inversify';
import { InferSelectModel } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { BaseRepository } from './base.repository';
import { CommandTable, commandTable } from './schema/command.schema';
import { Command } from '../domain/entities/command';

@injectable()
class CommandRepository extends BaseRepository<CommandTable, Command> {
  constructor(db: NodePgDatabase) {
    super(db, commandTable);
  }

  protected toDomain(row: InferSelectModel<CommandTable>): Command {
    return {
      id: row.id,
      commandName: row.commandName,
      startedAt: row.startedAt,
      endedAt: row.endedAt,
      metadata: row.metadata,
    };
  }
}

export { CommandRepository };
