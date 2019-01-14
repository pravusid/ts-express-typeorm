import * as Express from 'express';
import { homeController } from './api/home.controller';

class Router {
  public routes = Express.Router();

  constructor() {
    this.routes.use('', homeController.routes);
  }
}

export const router = new Router();
