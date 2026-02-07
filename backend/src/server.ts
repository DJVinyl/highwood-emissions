import 'reflect-metadata';
import { config as dotenvConfig } from 'dotenv';

import createApp from './app';
import { DependencyRegistry } from './configuration/dependency-registry';
import { createPostGresDataSource } from './configuration/database';

const PORT = process.env.NODE_ENV === 'production' ? 8080 : 4000;

(async () => {
  dotenvConfig();

  const dataSource = await createPostGresDataSource();
  const dependencyRegistry = new DependencyRegistry(dataSource);

  const database = dependencyRegistry.getDatabase();

  const app = await createApp(dependencyRegistry, database);

  app.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
    console.log(`server now running at http://localhost:${PORT}`);
    if (err) {
      throw err;
    }
  });
})();

// TODO: Add an exitHook
