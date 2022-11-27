import { Router } from 'express';
import { injectAll, singleton } from 'tsyringe';
import { Controller } from './types';

@singleton()
export class AppRouter {
  readonly routes: Router = Router();

  constructor(@injectAll(Controller) controllers: Controller[]) {
    this.routes.use(...controllers.map(({ routes }) => routes));
  }
}
