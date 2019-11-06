import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import { CustomExternalError } from '../domain/error/custom.external.error';
import { ErrorCode } from '../domain/error/error.code';
import { Post } from '../domain/post';
import { asyncHandler } from '../lib/error.handlers';
import { validation } from '../lib/validator';

class HomeController {
  readonly routes = Router();

  constructor() {
    this.routes.get('/:id', this.getPost);
    this.routes.post('/', this.savePost);
  }

  private getPost = asyncHandler(async (req: Request, resp: Response) => {
    try {
      const { id } = req.params;
      const post = await getRepository(Post).findOneOrFail(id);
      resp.json(post);
    } catch {
      throw new CustomExternalError([ErrorCode.ARTICLE_NOT_FOUND], 404);
    }
  });

  private savePost = asyncHandler(async (req: Request, resp: Response) => {
    const newPost = await validation(new Post(req.body));
    const post = await getRepository(Post).save(newPost);
    resp.status(201).json(post.id);
  });
}

export const homeController = new HomeController();
