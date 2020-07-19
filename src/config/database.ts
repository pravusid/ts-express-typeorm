import { join } from 'path';
import { ConnectionOptionsReader, createConnection, getConnection, Connection } from 'typeorm';
import { CustomNamingStrategy } from './custom.naming.strategy';

export const connectToDatabase = async (): Promise<Connection> => {
  const connectionOptions = new ConnectionOptionsReader().all();
  const [connectionOption] = await connectionOptions;

  return createConnection(
    Object.assign(connectionOption, {
      entities: [`${join(__dirname, '..')}/domain/**/*.{js,ts}`],
      namingStrategy: new CustomNamingStrategy(),
    }),
  );
};

export const disconnectFromDatabase = (): Promise<void> => getConnection().close();
