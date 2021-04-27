import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { Connection } from 'typeorm';
import { App } from './app';
import { connectToDatabase } from './config/database';
import { keepAliveStatus } from './lib/keep.alive.handler';
import { logger } from './lib/logger';

/* eslint-disable no-console */

dotenv.config();

function handleExit(error?: Error): void {
  if (error) {
    console.error('FATAL ERROR', error);
  }

  container
    .resolve(Connection)
    .close()
    .then(() => {
      console.info('database connection is closed');
      process.exit(error ? 1 : 0);
    })
    .catch(dbError => {
      console.error(dbError);
      process.exit(1);
    });
}

async function bootstrap(): Promise<void> {
  const { PORT } = process.env;

  const connection = await connectToDatabase();
  container.register(Connection, { useValue: connection });
  logger.info('database connection is established');

  const server = container.resolve(App).server.listen(PORT, () => {
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
