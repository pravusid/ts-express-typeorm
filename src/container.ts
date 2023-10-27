import { GraphQLSchema } from 'graphql';
import { Container as _Container } from 'inversify';
import { buildSchema } from 'type-graphql';
import { DataSource } from 'typeorm';
import { PingController } from './api/controller/ping.controller.js';
import { PostController } from './api/controller/post.controller.js';
import { PostFieldResolver, PostResolver } from './api/graphql/post.resolver.js';
import { App } from './app.js';
import { Controller } from './app.router.js';
import { database } from './infra/database.js';
import { logger } from './lib/logger.js';
import { Constructor } from './types/constructor.js';

export class Container {
  private static container = new _Container({
    defaultScope: 'Singleton',
    autoBindInjectable: true,
  });

  static async create(): Promise<App> {
    await Promise.all([
      this.loadControllers(),
      this.loadGraphQLSchema(),
      this.connectToDatabase(),
      //
    ]);
    return this.container.resolve(App);
  }

  static async destroy(): Promise<void> {
    await Promise.all([
      this.closeDatabase(),
      //
    ]);
  }

  private static loadControllers() {
    Array.from<Constructor<Controller>>([
      PingController,
      PostController,
      //
    ]).map((cls) => this.container.bind(Controller).to(cls));
  }

  private static async loadGraphQLSchema() {
    const schema = await buildSchema({
      resolvers: [
        PostResolver,
        PostFieldResolver,
        //
      ],
      validate: {
        /**
         * @see https://github.com/MichalLytek/type-graphql/issues/1396
         */
        forbidUnknownValues: false,
      },
      /**
       * @see https://github.com/MichalLytek/type-graphql/blob/master/src/utils/container.ts#L53
       */
      container: { get: (token) => this.container.resolve(token) },
    });
    this.container.bind(GraphQLSchema).toConstantValue(schema);
  }

  private static async connectToDatabase() {
    const dataSource = await database.init();
    this.container.bind(DataSource).toConstantValue(dataSource);
    logger.info('database connection is established');
  }

  private static async closeDatabase() {
    await this.container.resolve(DataSource).destroy();
    logger.info('database connection is closed');
  }
}
