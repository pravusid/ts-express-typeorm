import { createTerminus } from '@godaddy/terminus';
import 'reflect-metadata';
import { envs } from './config/environments.js';
import { Container } from './container.js';

/* eslint-disable no-console */

async function bootstrap(): Promise<void> {
  const app = await Container.create();
  await app.init();

  const server = app.server.listen(envs.port, () => {
    console.log(`listening on port ${envs.port} 🟢`);
  });

  createTerminus(server, {
    timeout: 30_000,
    signals: ['SIGTERM', 'SIGINT', 'SIGUSR2'],
    onSignal: () => {
      console.log('server is starting cleanup 🟠');
      return Container.destroy();
    },
    onShutdown: () => {
      console.log('server is terminating ⛔️');
      return Promise.resolve();
    },
    useExit0: true,
  });
}

bootstrap();
