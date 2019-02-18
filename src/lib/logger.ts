import { createLogger, format, transports } from 'winston';

const { combine, timestamp, json } = format;

export const logger = createLogger({
  level: 'debug',
  format: combine(timestamp(), json()),
  transports: [new transports.Console()],
});

if (process.env.NODE_ENV === 'production') {
  logger.configure({
    transports: [new transports.File({ filename: 'express-ts.log', level: 'info' })],
  });
}

export const winstonStream = {
  write(message: string) {
    logger.info(message);
  },
};
