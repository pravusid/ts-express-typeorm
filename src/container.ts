import { GraphQLSchema } from 'graphql';
import { Container as _Container } from 'inversify';
import { buildSchema } from 'type-graphql';
import { DataSource } from 'typeorm';
import { PingController } from './api/controller/ping.controller';
import { PostController } from './api/controller/post.controller';
import { PostFieldResolver, PostResolver } from './api/graphql/post.resolver';
import { App } from './app';
import { database } from './infra/database';
import { logger } from './lib/logger';
import { Constructor, Controller } from './types';

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
