import { Express, Request, Response, NextFunction } from 'express';

export const errorHandlerSync = (app: Express) => {
  app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
    response.status(500).json({ message: error.message });
    next();
  });
};
