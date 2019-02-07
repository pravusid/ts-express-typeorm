import { Router, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Post } from '../domain/post';
import { async } from '../lib/async.handler';
import { CustomError } from '../domain/error/custom.error';
import { validation } from '../lib/validator';
import { logger } from '../lib/logger';

class HomeController {
  routes = Router();

  constructor() {
    logger.debug('Initialize HomeController');

    this.routes.get('/:id', async(this.getPost));
    this.routes.post('', async(this.savePost));
  }

  async getPost(req: Request, resp: Response) {
    try {
      const id = req.params.id;
      const post = await getRepository(Post).findOneOrFail(id);
      resp.json(post);
    } catch {
      throw new CustomError(404, '요청 게시물이 존재하지 않습니다');
    }
  }

  async savePost(req: Request, resp: Response) {
    const newPost = await validation(new Post(req.body));
    const post = await getRepository(Post).save(newPost);
    resp.status(201).json(post.id);
  }
}

export const homeController = new HomeController();
