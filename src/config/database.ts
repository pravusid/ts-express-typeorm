import { createConnection, getConnectionOptions } from 'typeorm';
import { CustomNamingStrategy } from './custom.naming.strategy';

export const connectToDatabase = async () => {
  const option = await getConnectionOptions();
  return await createConnection(Object.assign(option, {
    namingStrategy: new CustomNamingStrategy(),
  }));
};
