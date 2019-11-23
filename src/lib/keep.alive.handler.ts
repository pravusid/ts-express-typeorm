import { NextFunction, Request, Response } from 'express';

export const keepAliveStatus = {
  isDisable: false,
};

export const keepAliveHandler = (request: Request, response: Response, next: NextFunction) => {
  if (keepAliveStatus.isDisable) {
    response.set('Connection', 'close');
  }
  next();
};
