import { configureApp } from './app';
import { logger } from './lib/logger';

require('dotenv').config();

const { PORT } = process.env;
const server = configureApp().listen(PORT, () => logger.info(`Listening on port ${PORT}`));

server.on('error', (error: any) => {
  if (error.syscall === 'listen' && ['EACCES', 'EADDRINUSE'].some(x => x === error.code)) {
    logger.error(`프로세스를 종료합니다: ${error.message}`);
    process.exit(1);
  }
  throw error;
});
