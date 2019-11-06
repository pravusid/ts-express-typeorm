import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as morgan from 'morgan';
import 'reflect-metadata';
import { connectToDatabase } from './config/database';
import { syncHandler } from './lib/error.handlers';
import { logger, winstonStream } from './lib/logger';
import { configureRouter } from './router';

export function configureApp(): express.Express {
  const app = express();

  const env = app.get('env');
  logger.info(`environment: ${env}`);

  app.disable('x-powered-by');

  app.use(env === 'production' ? morgan('combined', { stream: winstonStream }) : morgan('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(configureRouter());

  syncHandler(app);

  connectToDatabase().then(() => logger.info('connected to database'));

  return app;
}
