import 'reflect-metadata';
import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as path from 'path';

import { router } from './router';
import { logger } from './lib/logger';

class App {
  public app: express.Application;

  constructor() {
    // Initialization
    this.app = express();
    this.configuration();
    this.app.use(router.routes);
    logger.info(`environment: ${this.app.get('env')}`);
  }

  private configuration() {
    this.app.disable('x-powered-by');

    this.app.use(morgan('dev', {
      skip: () => this.app.get('env') === 'test',
    }));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.app.use(cors());
  }
}

export const app = new App().app;
