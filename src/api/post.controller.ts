import { Request, Response, Router } from 'express';
import { singleton } from 'tsyringe';
import { Post } from '../domain/post';
import { asyncHandler } from '../lib/error.handlers';
import { validate } from '../lib/validator';
import { PostService } from '../service/post.service';

@singleton()
export class PostController {
  readonly routes: Router = Router();

  constructor(private postService: PostService) {
    this.routes.get('/post/:id', this.getPost);
    this.routes.post('/post', this.savePost);
  }

  private getPost = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const post = await this.postService.getPost(id);

    return res.json(post);
  });

  private savePost = asyncHandler(async (req: Request, res: Response) => {
    const newPost = await validate(new Post(req.body));

    const created = await this.postService.createPost(newPost);

    return res.status(201).json({ id: created.id });
  });
}
