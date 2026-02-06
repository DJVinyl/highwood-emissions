import { DataSource, DataSourceOptions } from 'typeorm';

export const createPostGresDataSource = async (): Promise<DataSource> => {
  //TODO: Need Replacement in all environments
  const postgresOptions: DataSourceOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'root',
    password: 'test',
    database: 'regig',
    synchronize: true, // Should be turned off in prod?
    logging: true, // Should turn off in prod?
    // entities: [User],
    migrations: [],
    subscribers: [],
  };

  const postGresDataSource = new DataSource(postgresOptions);

  const database = await postGresDataSource.initialize();

  return database;
};
