import { Request, Response, Router } from 'express';
import { injectable } from 'inversify';
import { asyncHandler } from '../../lib/error.handlers.js';
import { PostService } from '../../service/post.service.js';
import { PostCreateDto } from './dto/post.create.dto.js';
import { PostResDto } from './dto/post.res.dto.js';

@injectable()
export class PostController {
  readonly routes: Router = Router();

  constructor(private postService: PostService) {
    this.routes.get('/post/:id', this.getPost);
    this.routes.post('/post', this.savePost);
  }

  private getPost = asyncHandler(async (req: Request<{ id: string }>, res: Response<PostResDto>) => {
    const { id } = req.params;

    const post = await this.postService.getPost(id);

    return res.json(PostResDto.fromEntity(post));
  });

  private savePost = asyncHandler(async (req: Request<never, unknown, unknown>, res: Response<{ id: string }>) => {
    const dto = await new PostCreateDto(req.body).throw();

    const created = await this.postService.createPost(dto.toEntity());

    return res.status(201).json({ id: created.id });
  });
}
