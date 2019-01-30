import { createConnection, getConnectionOptions } from 'typeorm';
import { CustomNamingStrategy } from './custom.naming.strategy';

const entities =
  process.env.NODE_ENV === 'production'
    ? 'dist/domain/**/*.js'
    : 'src/domain/**/*.ts';

export const connectToDatabase = async () => {
  const option = await getConnectionOptions();
  return await createConnection(
    Object.assign(option, {
      namingStrategy: new CustomNamingStrategy(),
      entities: [entities],
    }),
  );
};
