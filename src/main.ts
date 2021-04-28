import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { Connection } from 'typeorm';
import { App } from './app';
import { connectToDatabase } from './config/database';

/* eslint-disable no-console */

dotenv.config();

function handleExit(app: App, error?: Error): void {
  if (error) {
    console.error('FATAL ERROR', error);
  } else {
    console.log('프로세스를 종료합니다');
  }

  app
    .onClose()
    .then(() => {
      process.exit(error ? 1 : 0);
    })
    .catch(errorOnClose => {
      console.error(errorOnClose);
      process.exit(1);
    });
}

async function bootstrap(): Promise<void> {
  const { PORT } = process.env;

  const connection = await connectToDatabase();
  container.registerInstance(Connection, connection);

  const app = container.resolve(App);
  const server = app.init(Number(PORT) || 8080).on('error', error => handleExit(app, error));

  process.on('SIGINT', () => {
    app.beforeClose();
    server.close(error => handleExit(app, error));
  });
}

bootstrap();
