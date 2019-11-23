import * as pino from 'pino';

export const logger = pino({
  ...(process.env.NODE_ENV !== 'production' && { prettyPrint: { translateTime: true } }),
});

export const stream = {
  write(message: string) {
    logger.info(message);
  },
};
