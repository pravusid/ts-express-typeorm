import 'reflect-metadata';
import { envs } from './config/environments';
import { Container } from './container';

/* eslint-disable no-console */

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
  const app = await Container.create();
  await app.init();

  const server = app.server
    .listen(envs.port, () => {
      console.log(`listening on port ${envs.port} 🚀`);
    })
    .on('error', handleExit);

  const handleShutdown = () => {
    app.close();
    server.close(handleExit);
  };

  process.once('SIGINT', handleShutdown);
  process.once('SIGTERM', handleShutdown);
}

bootstrap();
