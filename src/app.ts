import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json, urlencoded } from 'body-parser';
import * as compression from 'compression';
import * as cors from 'cors';
import * as express from 'express';
import { GraphQLSchema } from 'graphql';
import helmet from 'helmet';
import * as morgan from 'morgan';
import { singleton } from 'tsyringe';
import { AppRouter } from './app.router';
import { GraphQLContext } from './graphql/context';
import { errorHandler, gqlErrorHandler, gqlFormatError } from './lib/error.handlers';
import { logger } from './lib/logger';

@singleton()
export class App {
  readonly server: express.Express = express();

  constructor(private router: AppRouter, private schema: GraphQLSchema) {}

  async init() {
    const {
      server,
      router: { routes },
      schema,
    } = this;

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

    server.use(routes);
    server.use(errorHandler);

    const apollo = new ApolloServer<GraphQLContext>({
      schema,
      formatError: gqlFormatError,
      plugins: [
        {
          requestDidStart: () => {
            return Promise.resolve({ didEncounterErrors: gqlErrorHandler });
          },
        },
      ],
    });
    await apollo.start();

    server.use(
      '/graphql',
      (_, res, next) => {
        // 앞 단계 미들웨어에서 오류발생했다면, graphQL 미들웨어 실행하지 않고 끝낼 수 있음
        if (res.encounteredErrorHandler) {
          return;
        }
        next();
      },
      expressMiddleware(apollo, {
        context: ({ req }) => Promise.resolve({ ip: req.ip }),
      }),
    );
  }
}
