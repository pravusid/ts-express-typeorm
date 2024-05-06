import { logger } from './logger.js';

describe('logger', () => {
  console.log('nodejs version', process.version);

  test('calling logger always returns identical object', () => {
    const logger1 = logger;
    const logger2 = logger;
    expect(logger1).toBe(logger2);
  });
});
