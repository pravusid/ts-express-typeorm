import * as pino from 'pino';

export const logger = pino({
  ...(process.env.NODE_ENV !== 'production' && { prettyPrint: { translateTime: true } }),
});
