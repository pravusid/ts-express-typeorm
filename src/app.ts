import 'reflect-metadata';

import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';

import { router } from './router';
import { logger } from './lib/logger';
import { connectToDatabase } from './config/database';

const app = express();

const env = app.get('env');
logger.info(`environment: ${env}`);

app.disable('x-powered-by');

app.use(morgan(env === 'development' ? 'dev' : 'combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);

connectToDatabase().then(() => logger.info('database is connected'));

export default app;
