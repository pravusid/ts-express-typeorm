import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { Connection } from 'typeorm';
import { configureApp } from './app';
import { connectToDatabase, disconnectFromDatabase } from './config/database';
import { keepAliveStatus } from './lib/keep.alive.handler';
import { logger } from './lib/logger';

dotenv.config();

/* eslint-disable no-console */
function handleExit(error?: Error) {
  if (error) {
    console.error('FATAL ERROR', error);
  }

  disconnectFromDatabase()
    .then(() => {
      console.info('database connection is closed');
      process.exit(error ? 1 : 0);
    })
    .catch(dbError => {
      console.error(dbError);
      process.exit(1);
    });
}

async function bootstrap() {
  const { PORT } = process.env;

  const connection = await connectToDatabase();
  container.register(Connection, { useValue: connection });
  logger.info('database connection is established');

  const server = configureApp().listen(PORT, () => {
    logger.info(`listening on port ${PORT}`);
  });

  server.on('error', handleExit);

  process.on('SIGINT', () => {
    logger.info('프로세스를 종료합니다: SIGINT');
    keepAliveStatus.isDisable = true;
    server.close(handleExit);
  });
}

bootstrap();
