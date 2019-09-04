import { ConnectionOptionsReader, createConnection } from 'typeorm';
import { CustomNamingStrategy } from './custom.naming.strategy';

export const connectToDatabase = async (env?: string) => {
  const ormEnv = process.env.ORM_ENV;
  const configName = env || ormEnv ? `ormconfig.${env || ormEnv}` : 'ormconfig';

  const connectionOptions = new ConnectionOptionsReader({ configName }).all();
  const [connectionOption] = await connectionOptions;

  return createConnection(
    Object.assign(connectionOption, {
      namingStrategy: new CustomNamingStrategy(),
    }),
  );
};
