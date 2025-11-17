import { AppLoggerService } from 'src/infrastructure/logging/logger.service';

export const createMockLogger = (): jest.Mocked<AppLoggerService> => {
  return {
    setContext: jest.fn(),
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  } as any;
};
