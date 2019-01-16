import { Request, Response, NextFunction } from 'express';
import { CustomError } from './custom.error';

type AsyncHandler = (req: Request, resp: Response, next: NextFunction) => Promise<any>;

export const async = (func: AsyncHandler) => {
  return (req: Request, resp: Response, next: NextFunction) =>
    Promise.resolve(func(req, resp, next)).catch((err: Error) => {
      resp.status(err instanceof CustomError ? err.statusCode : 500);
      resp.json({ error: err.message });
      next();
    });
};
