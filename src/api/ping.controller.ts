import { Request, Response, Router } from 'express';
import { singleton } from 'tsyringe';

@singleton()
export class PingController {
  readonly routes = Router();

  constructor() {
    this.routes.get('/ping', this.ping);
  }

  private ping = (req: Request, resp: Response): void => {
    resp.json({ message: 'pong' });
  };
}
