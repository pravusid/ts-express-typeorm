import { singleton } from 'tsyringe';
import { DataSource, Repository } from 'typeorm';
import { CustomExternalError } from '../domain/error/custom.external.error';
import { ErrorCode } from '../domain/error/error.code';
import { Post } from '../domain/post';

@singleton()
export class PostService {
  private postRepository: Repository<Post>;

  constructor(ds: DataSource) {
    this.postRepository = ds.getRepository(Post);
  }

  async getPost(id: number): Promise<Post> {
    try {
      const post = await this.postRepository.findOneOrFail({ where: { id } });
      return post;
    } catch {
      throw new CustomExternalError([ErrorCode.ARTICLE_NOT_FOUND], 404);
    }
  }

  createPost(newPost: Post): Promise<Post> {
    return this.postRepository.save(newPost);
  }
}
