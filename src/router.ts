import { Router } from 'express';
import { container } from 'tsyringe';
import { PostController } from './api/post.controller';

export function configureRouter(): Router {
  const router = Router();

  router.use(container.resolve(PostController).routes);

  return router;
}
