import { Router, Request, Response } from 'express';

class HomeController {
  public routes = Router();

  constructor() {
    this.routes.get('', this.hello);
  }

  hello(req: Request, res: Response) {
    res.status(200).send('Hello World!');
  }
}

export const homeController = new HomeController();
