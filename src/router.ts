import { Router } from 'express';
import { container, registry } from 'tsyringe';
import { PostController } from './api/post.controller';

export interface Controller {
  routes: Router;
}

@registry([{ token: 'Controller', useToken: PostController }])
export class ControllerRegistry {}

export function configureRouter(): Router {
  const router = Router();

  container.resolveAll<Controller>('Controller').forEach(ctrler => {
    router.use(ctrler.routes);
  });

  return router;
}
