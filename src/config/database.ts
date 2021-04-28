import { join } from 'path';
import { Connection, ConnectionOptionsReader, createConnection } from 'typeorm';
import { logger } from '../lib/logger';
import { CustomNamingStrategy } from './custom.naming.strategy';

export const connectToDatabase = async (): Promise<Connection> => {
  const reader = new ConnectionOptionsReader();
  const [connectionOption] = await reader.all();

  const connection = await createConnection(
    Object.assign(connectionOption, {
      entities: [`${join(__dirname, '..')}/domain/**/*.{js,ts}`],
      namingStrategy: new CustomNamingStrategy(),
    }),
  );

  logger.info('database connection is established');
  return connection;
};
