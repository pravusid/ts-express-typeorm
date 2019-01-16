import { Router, Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { Post } from '../domain/post';
import { async } from '../lib/async.handler';
import { CustomError } from '../lib/custom.error';

class HomeController {
  routes = Router();

  constructor() {
    this.routes.get('/:id', async(this.getPost));
    this.routes.post('', async(this.savePost));
  }

  async getPost(req: Request, resp: Response) {
    const id = req.params.id;
    const post = await getRepository(Post).findOneOrFail(id);
    (post ? resp.status(200) : resp.status(404)).json(post);
  }

  async savePost(req: Request, resp: Response, next: NextFunction) {
    const { title, author, content } = req.body;
    const newPost = new Post(title, author, content);
    if (!newPost.isValid()) {
      throw new CustomError(400, 'invalid');
    }
    const post = await getRepository(Post).save(newPost);
    resp.status(201).json(post.id);
  }
}

export const homeController = new HomeController().routes;
