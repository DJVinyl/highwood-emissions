import { InferInsertModel } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { PgTableWithColumns } from 'drizzle-orm/pg-core';

// abstract class BaseRepository<T extends PgTableWithColumns<any>> {
//   constructor(
//     protected readonly database: NodePgDatabase,
//     protected readonly table: T,
//   ) {}

//   public async insert(dataToInsert: InferInsertModel<T>) {
//     const insertResult = await this.database.insert(this.table).values(dataToInsert).returning();

//     return insertResult;
//   }
// }

abstract class BaseRepository<T extends PgTableWithColumns<any>> {
  protected constructor(
    protected readonly db: NodePgDatabase,
    protected readonly table: T,
  ) {}

  async insert(data: InferInsertModel<T>) {
    return this.db.insert(this.table).values(data).returning();
  }
}

export { BaseRepository };
