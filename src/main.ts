import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { Container } from './container';

/* eslint-disable no-console */

dotenv.config();

function handleExit(error?: Error): void {
  Container.destroy()
    .then(() => {
      if (error) {
        console.error('fatal error 🔥', error);
      } else {
        console.log('terminating ⛔️');
      }
      setTimeout(() => process.exit(error ? 1 : 0), 0);
    })
    .catch(errorOnClose => {
      console.error('error on close 💀', errorOnClose);
      setTimeout(() => process.exit(1), 0);
    });
}

async function bootstrap(): Promise<void> {
  const { PORT } = process.env;
  const port = Number(PORT ?? 8080);

  const app = await Container.create();
  const server = app.server
    .listen(port, () => {
      console.log(`listening on port ${port} 🚀`);
    })
    .on('error', handleExit);

  const shutdownHandler = () => {
    app.close();
    server.close(handleExit);
  };

  process.once('SIGINT', shutdownHandler);
  process.once('SIGTERM', shutdownHandler);
}

bootstrap();
