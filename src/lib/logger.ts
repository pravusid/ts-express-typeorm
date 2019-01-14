import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf } = format;

export const logger = createLogger({
  format: combine(
    timestamp(),
    printf((info) => {
      return `${info.timestamp} [${info.level}]: ${info.message}`;
    }),
  ),
  transports: [new transports.Console()],
});
