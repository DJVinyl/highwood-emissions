import { sql } from 'drizzle-orm';

import { createPostGresDataSource } from '../src/configuration/database';

async function main() {
  if (!process.env.DATABASE_URL) {
    console.log('Error - no database URL found');
  }

  const db = await createPostGresDataSource();

  await db.execute(sql`
    TRUNCATE TABLE
      sites,
      measurements,
      commands
    RESTART IDENTITY
    CASCADE;
  `);
}

(async () => await main())();
