import { and, eq, getTableColumns, InferInsertModel, InferSelectModel, SQL } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { PgTable, SelectedFields, TableConfig } from 'drizzle-orm/pg-core';

abstract class BaseRepository<T extends PgTable<TableConfig>, DomainObject> {
  protected columns: ReturnType<typeof getTableColumns<T>>;

  protected constructor(
    protected readonly db: NodePgDatabase,
    protected readonly table: T,
  ) {
    this.columns = getTableColumns(table);
  }

  async findAll(whereFilters?: Partial<InferSelectModel<T>>): Promise<DomainObject[] | undefined> {
    const query = this.db.select().from(this.table as any);

    if (whereFilters && Object.keys(whereFilters).length > 0) {
      const conditions: SQL[] = [];

      for (const [key, value] of Object.entries(whereFilters)) {
        const column = this.columns[key];
        if (column && value !== undefined) {
          conditions.push(eq(column, value));
        }
      }

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }
    }

    const results = await query;
    return results.map((row) => this.toDomain(row as InferSelectModel<T>));
  }

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
