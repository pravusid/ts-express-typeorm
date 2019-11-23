import { json, urlencoded } from 'body-parser';
import * as compression from 'compression';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import 'reflect-metadata';
import { errorHandler } from './lib/error.handlers';
import { logger, stream } from './lib/logger';
import { configureRouter } from './router';

export function configureApp(): express.Express {
  const app = express();

  const env = app.get('env');
  logger.info(`environment: ${env}`);

  app.use(helmet());
  app.use(env === 'production' ? morgan('combined', { stream }) : morgan('dev'));
  app.use(cors({ exposedHeaders: ['Content-Disposition'] }));

  app.use(json());
  app.use(urlencoded({ extended: false }));
  app.use(compression());

  app.use(configureRouter());
  app.use(errorHandler);

  return app;
}
