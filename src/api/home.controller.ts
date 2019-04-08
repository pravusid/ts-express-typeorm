import { Router, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Post } from '../domain/post';
import { async } from '../lib/async.handler';
import { CustomExternalError } from '../domain/error/custom.errors';
import { validation } from '../lib/validator';
import { logger } from '../lib/logger';
import { ErrorCode } from '../domain/error/error.code';

class HomeController {
  routes = Router();

  constructor() {
    logger.debug('HomeController Initialized');

    this.routes.get('/:id', async(this.getPost));
    this.routes.post('', async(this.savePost));
  }

  async getPost(req: Request, resp: Response) {
    try {
      const { id } = req.params;
      const post = await getRepository(Post).findOneOrFail(id);
      resp.json(post);
    } catch {
      throw new CustomExternalError([ErrorCode.ARTICLE_NOT_FOUND], 404);
    }
  }

  async savePost(req: Request, resp: Response) {
    const newPost = await validation(new Post(req.body));
    const post = await getRepository(Post).save(newPost);
    resp.status(201).json(post.id);
  }
}

export const homeController = new HomeController();
