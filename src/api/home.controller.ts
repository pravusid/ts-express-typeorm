import { Router, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Post } from '../domain/post';

class HomeController {
  routes = Router();

  constructor() {
    this.routes.get('/:id', this.getPost);
    this.routes.post('', this.savePost);
  }

  async getPost(req: Request, resp: Response) {
    const id = req.params.id;
    const post = await getRepository(Post).findOne(id);
    resp.status(200).send(post);
  }

  async savePost(req: Request, resp: Response) {
    const post = req.body;
    await getRepository(Post).save(post);
    resp.status(201).send(post);
  }
}

export const homeController = new HomeController().routes;
