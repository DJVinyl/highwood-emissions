import { Container, interfaces } from 'inversify';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { SiteController } from '../api/http/site.controller';
import { SiteProvider } from '../domain/providers/site.provider';
import { SiteRepository } from '../repository/site.repository';
import { IngestController } from '../api/http/ingest.controller';
import { IngestProvider } from '../domain/providers/ingest.provider';
import { MeasurementRepository } from '../repository/measurement.repository';
import { CommandRepository } from '../repository/command.repository';

class DependencyRegistry {
  private container: Container;
  private database: NodePgDatabase;

  constructor(database: NodePgDatabase) {
    this.container = new Container();
    this.database = database;

    // ----------------------------------
    //HTTP Controllers
    // ----------------------------------
    this.registerSingleton(SiteController);
    this.registerSingleton(IngestController);
    // ----------------------------------
    // ----------------------------------
    //Providers
    // ----------------------------------
    this.registerSingleton(SiteProvider);
    this.registerSingleton(IngestProvider);
    // ----------------------------------
    // ----------------------------------
    //Repository
    // ----------------------------------
    this.registerSingletonWithConstructor(SiteRepository, () => new SiteRepository(this.database));
    this.registerSingletonWithConstructor(
      MeasurementRepository,
      () => new MeasurementRepository(this.database, this.container.get(SiteRepository)),
    );
    this.registerSingletonWithConstructor(CommandRepository, () => new CommandRepository(this.database));
    // ----------------------------------
    //Consumers
    // ----------------------------------
    // ----------------------------------
    //Producers
    // ----------------------------------
  }

  public resolve<T>(constructorFunction: interfaces.Newable<T>): T {
    return this.container.resolve(constructorFunction);
  }

  public registerSingletonWithConstructor<T>(
    provider: interfaces.ServiceIdentifier<T>,
    dynamicValue: interfaces.DynamicValue<T>,
  ): void {
    this.container.bind<T>(provider).toDynamicValue(dynamicValue).inSingletonScope();
  }

  public registerSingleton<T>(provider: interfaces.ServiceIdentifier<T>): void {
    this.container.bind<T>(provider).toSelf().inSingletonScope();
  }

  public getDatabase(): NodePgDatabase {
    return this.database;
  }
}

// const dependencyRegistry = new DependencyRegistry();

// const getDependencyRegistryInstance = (): DependencyRegistry => {
//   if (!dependencyRegistry) {
//     return new DependencyRegistry();
//   }

//   return dependencyRegistry;
// };

export { DependencyRegistry };
