import 'reflect-metadata';
import { container } from 'tsyringe';
import { Connection } from 'typeorm';
import { configureApp } from './app';
import { connectToDatabase, disconnectFromDatabase } from './config/database';
import { keepAliveStatus } from './lib/keep.alive.handler';
import { logger } from './lib/logger';

require('dotenv').config();

const { PORT } = process.env;

connectToDatabase().then(connection => {
  container.register(Connection, { useValue: connection });
  logger.info('database connection is established');

  const server = configureApp().listen(PORT, () => {
    logger.info(`listening on port ${PORT}`);
  });

  const handleError = (error?: Error) => {
    if (error) {
      logger.error('FATAL ERROR', error);
    }

    const code = error ? 1 : 0;

    disconnectFromDatabase()
      .then(() => {
        logger.info('closed database connections');
        process.exit(code);
      })
      .catch(dbError => {
        logger.error(dbError);
        process.exit(1);
      });
  };

  server.on('error', (error: Error) => handleError(error));

  process.on('SIGINT', () => {
    logger.info('프로세스를 종료합니다: SIGINT');
    keepAliveStatus.isDisable = true;
    server.close(error => handleError(error));
  });
});
