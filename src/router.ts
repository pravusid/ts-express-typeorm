import { Router } from 'express';
import { container, registry } from 'tsyringe';
import { PingController } from './api/ping.controller';
import { PostController } from './api/post.controller';

const CONTROLLER_TOKEN = 'controller';

interface Controller {
  routes: Router;
}

@registry([
  { token: CONTROLLER_TOKEN, useToken: PingController },
  { token: CONTROLLER_TOKEN, useToken: PostController },
])
export class ControllerRegistry {}

export function configureRouter(): Router {
  const router = Router();

  container.resolveAll<Controller>(CONTROLLER_TOKEN).forEach(ctrler => {
    router.use(ctrler.routes);
  });

  return router;
}
