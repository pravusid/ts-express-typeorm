import { join } from 'path';
import { ConnectionOptionsReader, createConnection, getConnection } from 'typeorm';
import { CustomNamingStrategy } from './custom.naming.strategy';

export const connectToDatabase = async () => {
  const connectionOptions = new ConnectionOptionsReader().all();
  const [connectionOption] = await connectionOptions;

  return createConnection(
    Object.assign(connectionOption, {
      entities: [`${join(__dirname, '..')}/domain/**/*.{js,ts}`],
      namingStrategy: new CustomNamingStrategy(),
    }),
  );
};

export const disconnectFromDatabase = () => getConnection().close();
