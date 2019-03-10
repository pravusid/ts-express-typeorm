import { createConnection, getConnectionOptions, ConnectionOptionsReader } from 'typeorm';
import { CustomNamingStrategy } from './custom.naming.strategy';

export const connectToDatabase = async () => {
  const connectionOptions = await (process.env.NODE_ENV === 'production'
    ? getConnectionOptions()
    : new ConnectionOptionsReader({ configName: 'ormconfig.dev' }).get('default'));

  return await createConnection(
    Object.assign(connectionOptions, {
      namingStrategy: new CustomNamingStrategy(),
    }),
  );
};
