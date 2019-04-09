import { Request, Response, NextFunction } from 'express';
import { CustomExternalError, CustomInternalError } from '../domain/error/custom.errors';
import { logger } from './logger';
import { ErrorCode } from '../domain/error/error.code';

type AsyncFunc = (req: Request, resp: Response, next: NextFunction) => Promise<any>;

export const asyncHandler: (func: AsyncFunc) => AsyncFunc = func => (request, response, next) =>
  Promise.resolve(func(request, response, next)).catch((err: Error) => {
    if (err instanceof CustomExternalError) {
      response.status(err.statusCode).json({ errors: err.messages });
    } else {
      if (err instanceof CustomInternalError) {
        logger.error(ErrorCode.INTERNAL_ERROR, {
          message: err.message,
          stack: err.stackArray,
        });
      }
      response.status(500).json({ message: ErrorCode.INTERNAL_ERROR });
    }
    next();
  });
