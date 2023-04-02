import { Router } from 'express';
import { injectable, multiInject } from 'inversify';
import { Controller } from './types';

@injectable()
export class AppRouter {
  readonly routes: Router = Router();

  constructor(@multiInject(Controller) controllers: Controller[]) {
    this.routes.use(...controllers.map(({ routes }) => routes));
  }
}
