import { Router } from 'express';
import { homeController } from './api/home.controller';

export function configureRouter(): Router {
  const router = Router();
  router.use(homeController.routes);

  return router;
}
