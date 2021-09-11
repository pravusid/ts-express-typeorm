import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { Container } from './container';

/* eslint-disable no-console */

dotenv.config();

async function handleExit(error?: Error): Promise<void> {
  if (error) {
    console.error('FATAL ERROR', error);
  } else {
    console.log('terminating process...');
  }

  try {
    await Container.destroy();
    process.exit(error ? 1 : 0);
  } catch (errorOnClose) {
    console.error(errorOnClose);
    process.exit(1);
  }
}

async function bootstrap(): Promise<void> {
  const { PORT } = process.env;

  const app = await Container.create();
  const server = app.init(PORT).on('error', handleExit);

  process.on('SIGINT', () => {
    app.close();
    server.close(handleExit);
  });
}

bootstrap();
