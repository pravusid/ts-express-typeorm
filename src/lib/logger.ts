import * as pino from 'pino';

export const logger = pino({
  ...(process.env.NODE_ENV !== 'production' && { prettyPrint: { translateTime: true } }),
});

export const stream = {
  write(message: string): void {
    logger.info(message);
  },
};
