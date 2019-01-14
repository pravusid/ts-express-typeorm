import * as express from 'express';
import { homeController } from './api/home.controller';

class Router {
  routes = express.Router();

  constructor() {
    this.routes.use('', homeController);
  }
}

export const router = new Router();
