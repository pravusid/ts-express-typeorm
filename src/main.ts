import { configureApp } from './app';
import { connectToDatabase, disconnectDatabase } from './config/database';
import { keepAliveStatus } from './lib/keep.alive.handler';
import { logger } from './lib/logger';

require('dotenv').config();

const { PORT } = process.env;
const server = configureApp().listen(PORT, () => {
  logger.info(`listening on port ${PORT}`);
  connectToDatabase().then(() => logger.info('connected to database'));
});

const handleError = (code = 0) => {
  disconnectDatabase()
    .then(() => {
      logger.info('closed database connections');
      process.exit(code);
    })
    .catch(error => {
      logger.error(error);
      process.exit(1);
    });
};

server.on('error', (error: Error) => {
  logger.error('FATAL ERROR', error);
  handleError(1);
});

process.on('SIGINT', () => {
  logger.info('프로세스를 종료합니다: SIGINT');
  keepAliveStatus.isDisable = true;
  server.close(() => {
    handleError();
  });
});
