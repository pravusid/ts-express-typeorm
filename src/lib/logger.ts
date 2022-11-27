import pino from 'pino';
import { envs } from '../config/environments';

export const logger = pino({ level: envs.isProd ? 'info' : 'debug' });
