import { container } from 'tsyringe';
import { Connection } from 'typeorm';
import { PingController } from './api/ping.controller';
import { PostController } from './api/post.controller';
import { App } from './app';
import { Controller } from './app.router';
import { database } from './config/database';

/* eslint-disable no-console */

export class AppModule {
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
    container.registerSingleton(Controller, PingController);
    container.registerSingleton(Controller, PostController);
  }

  private static async initDatabase() {
    const connection = await database.connect();
    container.registerInstance(Connection, connection);
    console.log('database connection is established');
  }

  private static async closeDatabase() {
    await container.resolve(Connection).close();
    console.log('database connection is closed');
  }
}
