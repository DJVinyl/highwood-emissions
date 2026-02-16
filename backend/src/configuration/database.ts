import 'dotenv/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';

export const createPostGresDataSource = async (): Promise<NodePgDatabase> => {
  try {
    const db = drizzle(process.env.DATABASE_URL!);
    if (!db) {
      throw new Error('Error initalizing DB.');
    }
    return db;
  } catch (error) {
    throw error;
  }
};
