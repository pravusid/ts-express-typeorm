import app from './app';
import { logger } from './lib/logger';

require('dotenv').config();

const { PORT } = process.env;
app.listen(PORT, () => logger.info(`Listening on port ${PORT}`));
