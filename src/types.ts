import { Router } from 'express';

declare global {
  namespace Express {
    // export interface Request {}
    // export interface Response {}
  }
}

export type Constructor<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): T;
};

export class Controller {
  readonly routes: Router;
}
