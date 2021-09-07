import { NextFunction, Request, Response } from 'express';
import { CustomExternalError } from '../domain/error/custom.external.error';
import { CustomInternalError } from '../domain/error/custom.internal.error';
import { ErrorCode } from '../domain/error/error.code';
import { logger } from './logger';

export const errorHandler = (error: Error, request: Request, response: Response, next: NextFunction): void => {
  if (error instanceof CustomExternalError) {
    response.status(error.statusCode).json({ errors: error.messages });
  } else {
    logger.error(ErrorCode.INTERNAL_ERROR, {
      errorMessage: error.message,
      stack: error instanceof CustomInternalError ? error.stackArray : error.stack,
    });
    response.status(500).json({ message: ErrorCode.INTERNAL_ERROR });
  }
  next();
};

type AsyncFunc = (req: Request, resp: Response, next: NextFunction) => Promise<void>;

export const asyncHandler: (func: AsyncFunc) => AsyncFunc =
  func =>
  (request, response, next): Promise<void> =>
    Promise.resolve(func(request, response, next)).catch((error: Error) =>
      errorHandler(error, request, response, next),
    );
