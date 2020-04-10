import { Router } from 'express';
import { container } from 'tsyringe';
import { PostController } from './api/post.controller';

export function configureRouter(): Router {
  return Router().use(container.resolve(PostController).routes);
}
