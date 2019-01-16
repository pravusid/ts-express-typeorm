import * as express from 'express';
import { homeController } from './api/home.controller';

class Router {
  router = express.Router();

  constructor() {
    this.router.use('', homeController);
  }
}

export const router = new Router().router;
