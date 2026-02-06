import { inject, injectable } from 'inversify';
import { DataSource } from 'typeorm';

@injectable()
class TestRouteController {
  constructor() {}

  public helloWorld(): string {
    return 'Hello, World!';
  }
}

export { TestRouteController };
