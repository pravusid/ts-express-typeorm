import { GraphQLSchema } from 'graphql';
import { container } from 'tsyringe';
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
  static async create(): Promise<App> {
    await Promise.all([
      this.loadControllers(),
      this.loadGraphQLSchema(),
      this.connectToDatabase(),
      //
    ]);
    return container.resolve(App);
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
    ]).map((cls) => container.registerType(Controller, cls));
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
      container: { get: (token) => container.resolve(token) },
    });
    container.registerInstance(GraphQLSchema, schema);
  }

  private static async connectToDatabase() {
    const dataSource = await database.init();
    container.registerInstance(DataSource, dataSource);
    logger.info('database connection is established');
  }

  private static async closeDatabase() {
    await container.resolve(DataSource).destroy();
    logger.info('database connection is closed');
  }
}
