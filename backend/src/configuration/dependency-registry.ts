import { Container, interfaces } from 'inversify';
import { TestRouteController } from '../api/http/test-route-controller';
import { DataSource } from 'typeorm';

class DependencyRegistry {
  private container: Container;
  private database: DataSource;

  constructor(database: DataSource) {
    this.container = new Container();
    this.database = database;

    //HTTP Controllers
    //THis is most likely going to be only the database layer. This is a test route
    this.registerSingletonWithConstructor(TestRouteController, () => new TestRouteController(this.database));


    //Providers




    //Consumers

    //Producers
  }

  public resolve<T>(constructorFunction: interfaces.Newable<T>): T {
    return this.container.resolve(constructorFunction);
  }

  public registerSingletonWithConstructor<T>(
    provider: interfaces.ServiceIdentifier<T>,
    dynamicValue: interfaces.DynamicValue<T>
  ): void {
    this.container.bind<T>(provider).toDynamicValue(dynamicValue).inSingletonScope();
  }

  public registerSingleton<T>(provider: interfaces.ServiceIdentifier<T>): void {
    this.container.bind<T>(provider).toSelf().inSingletonScope();
  }

  public getDatabase(): DataSource {
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
