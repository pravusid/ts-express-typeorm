import { join } from 'path';
import { Connection, ConnectionOptionsReader, createConnection } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const database = {
  connect: async (): Promise<Connection> => {
    const reader = new ConnectionOptionsReader();
    const [connectionOption] = await reader.all();

    return createConnection(
      Object.assign(connectionOption, {
        entities: [`${join(__dirname, '..')}/domain/**/*.{js,ts}`],
        namingStrategy: new SnakeNamingStrategy(),
      }),
    );
  },
};
