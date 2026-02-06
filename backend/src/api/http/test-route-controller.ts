import { inject, injectable } from 'inversify';

@injectable()
class TestRouteController {
  constructor() {}

  public helloWorld(): string {
    return 'Hello, World!';
  }
}

export { TestRouteController };
