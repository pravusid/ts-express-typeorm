import { injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { CustomExternalError } from '../domain/error/custom.external.error.js';
import { ErrorCode } from '../domain/error/error.code.js';
import { Post, PostCreate } from '../domain/post.js';

@injectable()
export class PostService {
  private postRepository: Repository<Post>;

  constructor(ds: DataSource) {
    this.postRepository = ds.getRepository(Post);
  }

  async getPost(id: string): Promise<Post> {
    try {
      const post = await this.postRepository.findOneOrFail({ where: { id } });
      return post;
    } catch {
      throw new CustomExternalError([ErrorCode.ARTICLE_NOT_FOUND]);
    }
  }

  createPost(newPost: PostCreate): Promise<Post> {
    return this.postRepository.save(newPost);
  }
}
