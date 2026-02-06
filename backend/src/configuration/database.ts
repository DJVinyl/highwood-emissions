import 'dotenv/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';

export const createPostGresDataSource = async (): Promise<NodePgDatabase> => {
  const db = drizzle(process.env.DATABASE_URL!);
  return db;
};
