import { Request, Response, Router } from 'express';
import { injectable } from 'inversify';

@injectable()
export class PingController {
  readonly routes: Router = Router();

  constructor() {
    this.routes.get('/ping', this.ping);
  }

  private ping = (req: Request, res: Response) => {
    return res.json({ message: 'pong' });
  };
}
