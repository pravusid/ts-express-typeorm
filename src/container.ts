import { container } from 'tsyringe';
import type { constructor } from 'tsyringe/dist/typings/types';
import { Connection } from 'typeorm';
import { PingController } from './api/ping.controller';
import { PostController } from './api/post.controller';
import { App } from './app';
import { Controller } from './app.router';
import { database } from './config/database';
import { logger } from './lib/logger';

export class Container {
  static async create(): Promise<App> {
    await Promise.all([
      //
      this.initController(),
      this.initDatabase(),
    ]);

    return container.resolve(App);
  }

  static async destroy(): Promise<void> {
    await Promise.all([
      //
      this.closeDatabase(),
    ]);
  }

  private static initController() {
    Array.from<constructor<Controller>>([
      //
      PingController,
      PostController,
    ]).map(cls => container.registerType(Controller, cls));
  }

  private static async initDatabase() {
    const connection = await database.connect();
    container.registerInstance(Connection, connection);
    logger.info('database connection is established');
  }

  private static async closeDatabase() {
    await container.resolve(Connection).close();
    logger.info('database connection is closed');
  }
}
