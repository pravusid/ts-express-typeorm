import { Router, Request, Response, NextFunction } from 'express';
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
    (post ? resp.status(200) : resp.status(404)).json(post);
  }

  async savePost(req: Request, resp: Response, next: NextFunction) {
    try {
      const { title, author, content } = req.body;
      const newPost = new Post(title, author, content);
      if (!newPost.isValid()) {
        throw new Error('invalid');
      }
      const post = await getRepository(Post).save(newPost);
      resp.status(201).json(post.id);
    } catch (error) {
      next(error);
    }
  }
}

export const homeController = new HomeController().routes;
