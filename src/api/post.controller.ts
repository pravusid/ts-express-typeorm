import { Request, Response, Router } from 'express';
import { inject, singleton } from 'tsyringe';
import { Post } from '../domain/post';
import { asyncHandler } from '../lib/error.handlers';
import { validation } from '../lib/validator';
import { PostService } from '../service/post.service';

@singleton()
export class PostController {
  readonly routes = Router();

  constructor(@inject(PostService) private postService: PostService) {
    this.routes.get('/:id', this.getPost);
    this.routes.post('/', this.savePost);
  }

  private getPost = asyncHandler(async (req: Request, resp: Response) => {
    const { id } = req.params;

    const post = await this.postService.getPost(id);
    resp.json(post);
  });

  private savePost = asyncHandler(async (req: Request, resp: Response) => {
    const newPost = await validation(new Post(req.body));

    const created = await this.postService.createPost(newPost);
    resp.status(201).json({ id: created.id });
  });
}
