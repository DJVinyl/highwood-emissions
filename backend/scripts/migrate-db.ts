import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { createPostGresDataSource } from '../src/configuration/database';

async function main() {
  const db = await createPostGresDataSource();
  await migrate(db, { migrationsFolder: './drizzle' });
}

(async () => await main())();
