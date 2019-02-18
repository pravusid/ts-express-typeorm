import 'reflect-metadata';

import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';

import { router } from './router';
import { logger, winstonStream } from './lib/logger';
import { connectToDatabase } from './config/database';

const app = express();

const env = app.get('env');
logger.info(`environment: ${env}`);

app.disable('x-powered-by');

app.use(env === 'production' ? morgan('combined', { stream: winstonStream }) : morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);

connectToDatabase().then(() => logger.info('connected to database'));

export default app;
