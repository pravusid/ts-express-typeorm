import { Request, Response, Router } from 'express';
import { singleton } from 'tsyringe';

@singleton()
export class PingController {
  readonly routes: Router = Router();

  constructor() {
    this.routes.get('/ping', this.ping);
  }

  private ping = (req: Request, res: Response) => {
    return res.json({ message: 'pong' });
  };
}
