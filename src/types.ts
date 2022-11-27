import { Router } from 'express';

declare global {
  namespace Express {
    export interface Response {
      encounteredErrorHandler?: boolean;
    }
  }
}

export type Constructor<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): T;
};

export class Controller {
  readonly routes: Router;
}
