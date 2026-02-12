import { eq, InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { PgTable, TableConfig } from 'drizzle-orm/pg-core';

abstract class BaseRepository<T extends PgTable<TableConfig>, DomainObject> {
  protected constructor(
    protected readonly db: NodePgDatabase,
    protected readonly table: T,
  ) {}

  async findOne(id: string): Promise<DomainObject | undefined> {
    const result = await this.db
      .select()
      .from(this.table as any)
      .where(eq((this.table as any).id, id))
      .limit(1);

    if (result[0]) {
      return this.toDomain(result[0] as InferSelectModel<T>);
    }

    return undefined;
  }

  async insert(data: InferInsertModel<T>) {
    const result = await this.db.insert(this.table).values(data).returning();

    return this.toDomain(result as InferSelectModel<T>);
  }

  protected abstract toDomain(row: InferSelectModel<T>): DomainObject;
}

export { BaseRepository };
