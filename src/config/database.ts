import { createConnection, ConnectionOptionsReader } from 'typeorm';
import { CustomNamingStrategy } from './custom.naming.strategy';

export const connectToDatabase = async (env?: string) => {
  const entityEnv = process.env.ENTITY_ENV;
  const configName = env || entityEnv ? `ormconfig.${env || entityEnv}` : 'ormconfig';

  const connectionOptions = new ConnectionOptionsReader({ configName }).all();
  const [connectionOption] = await connectionOptions;

  return createConnection(
    Object.assign(connectionOption, {
      namingStrategy: new CustomNamingStrategy(),
    }),
  );
};
