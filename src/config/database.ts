import { createConnection, getConnectionOptions, ConnectionOptionsReader } from 'typeorm';
import { CustomNamingStrategy } from './custom.naming.strategy';

export const connectToDatabase = async () => {
  const env = process.env.NODE_ENV;
  const configName = env === 'production' ? 'ormconfig' : `ormconfig.${env}`;
  const connectionOptions = new ConnectionOptionsReader({ configName }).all();
  const [connectionOption] = await connectionOptions;

  return createConnection(
    Object.assign(connectionOption, {
      namingStrategy: new CustomNamingStrategy(),
    }),
  );
};
