import { Router } from 'express';
import { injectAll, registry, singleton } from 'tsyringe';
import { PingController } from './api/ping.controller';
import { PostController } from './api/post.controller';

class Controller {
  routes: Router;
}

@registry([
  { token: Controller, useToken: PingController },
  { token: Controller, useToken: PostController },
])
@singleton()
export class AppRouter {
  readonly routes = Router();

  constructor(@injectAll(Controller) controllers: Controller[]) {
    this.routes.use(...controllers.map(({ routes }) => routes));
  }
}
