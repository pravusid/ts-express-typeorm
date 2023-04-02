import { join } from 'path';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import url from 'url';
import { envs } from '../config/environments.js';

// eslint-disable-next-line
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export const database = {
  init: (): Promise<DataSource> => {
    const ds = new DataSource({
      name: 'default',
      type: 'mysql',
      host: envs.db.host,
      port: envs.db.port,
      username: envs.db.username,
      password: envs.db.password,
      database: envs.db.database,
      logging: envs.isProd === false,
      synchronize: true,
      entities: [`${join(__dirname, '..')}/domain/**/*.{js,ts}`],
      namingStrategy: new SnakeNamingStrategy(),
    });
    return ds.initialize();
  },
};
