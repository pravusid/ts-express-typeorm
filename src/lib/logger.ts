import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf } = format;

export const logger = createLogger({
  level: 'debug',
  format: combine(
    timestamp(),
    printf((info) => {
      return `${info.timestamp} [${info.level}]: ${info.message}`;
    }),
  ),
  transports: [new transports.Console()],
});

if (process.env.NODE_ENV === 'production') {
  logger.configure({
    transports: [new transports.File({ filename: 'express-ts.log', level: 'info' })],
  });
}
