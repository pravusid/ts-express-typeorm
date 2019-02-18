import { Request, Response, NextFunction } from 'express';
import { CustomExternalError, CustomInternalError } from '../domain/error/custom.errors';
import { logger } from './logger';

type AsyncHandler = (
  req: Request,
  resp: Response,
  next: NextFunction,
) => Promise<any>;

export const async = (func: AsyncHandler) => {
  return (request: Request, response: Response, next: NextFunction) =>
    Promise.resolve(func(request, response, next)).catch((err: Error) => {
      if (err instanceof CustomInternalError) {
        logger.error('Internal Error', { message: err.message, stack: err.stackArray });
      }

      const getErrors = () => {
        try {
          return JSON.parse(err.message);
        } catch {
          return [{ message: err.message }];
        }
      };

      response.status(err instanceof CustomExternalError ? err.statusCode : 500);
      response.json(err instanceof CustomExternalError ? { errors: getErrors() } : 'Server Error');
      next();
    });
};
