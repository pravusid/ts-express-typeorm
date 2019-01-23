import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../domain/error/custom.error';

type AsyncHandler = (
  req: Request,
  resp: Response,
  next: NextFunction,
) => Promise<any>;

export const async = (func: AsyncHandler) => {
  return (request: Request, response: Response, next: NextFunction) =>
    Promise.resolve(func(request, response, next)).catch((err: Error) => {
      const getErrors = () => {
        try {
          return JSON.parse(err.message);
        } catch {
          return [{ message: err.message }];
        }
      };
      response.status(err instanceof CustomError ? err.statusCode : 500);
      response.json({ errors: getErrors() });
      next();
    });
};
