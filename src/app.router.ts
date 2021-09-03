import { Router } from 'express';
import { injectAll, singleton } from 'tsyringe';

export class Controller {
  routes: Router;
}

@singleton()
export class AppRouter {
  readonly routes = Router();

  constructor(@injectAll(Controller) controllers: Controller[]) {
    this.routes.use(...controllers.map(({ routes }) => routes));
  }
}
