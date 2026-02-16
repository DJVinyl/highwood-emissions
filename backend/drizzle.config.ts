import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: [
    './src/repository/schema/command.schema.ts',
    './src/repository/schema/measurement.schema.ts',
    // './src/repository/schema/outbox.schema.ts', // TODO: to be implemented
    './src/repository/schema/site.schema.ts',
  ],
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
