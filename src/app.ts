import { json, urlencoded } from 'body-parser';
import * as compression from 'compression';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import { Server } from 'http';
import * as morgan from 'morgan';
import { singleton } from 'tsyringe';
import { Connection } from 'typeorm';
import { AppRouter } from './app.router';
import { errorHandler } from './lib/error.handlers';
import { logger } from './lib/logger';

@singleton()
export class App {
  private readonly server = express();

  private isKeepAliveDisabled = false;

  constructor({ routes }: AppRouter, private connection: Connection) {
    const { server } = this;

    const env = server.get('env');
    logger.info(`environment: ${env}`);

    server.use(helmet());
    server.use(
      env === 'production'
        ? morgan('combined', {
            stream: {
              write(message: string): void {
                logger.info(message);
              },
            },
          })
        : morgan('dev'),
    );
    server.use(cors({ exposedHeaders: ['Content-Disposition'] }));

    server.use(json());
    server.use(urlencoded({ extended: false }));
    server.use(compression());
    server.use((request, response, next): void => {
      if (this.isKeepAliveDisabled) {
        response.set('Connection', 'close');
      }
      next();
    });

    server.use(routes);
    server.use(errorHandler);
  }

  init(port: number): Server {
    return this.server.listen(port, () => {
      logger.info(`listening on port ${port}`);
    });
  }

  beforeClose(): void {
    this.isKeepAliveDisabled = true;
  }

  onClose(): Promise<unknown> {
    return Promise.all([
      //
      this.connection.close().then(() => logger.info('database connection is closed')),
    ]);
  }
}
