import { logger } from '../../src/lib/logger';

describe('logger', () => {
  test('calling logger always returns identical object', () => {
    const logger1 = logger;
    const logger2 = logger;
    expect(logger1).toBe(logger2);
  });
});
