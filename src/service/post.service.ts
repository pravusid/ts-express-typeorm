import { singleton } from 'tsyringe';
import { Connection, Repository } from 'typeorm';
import { CustomExternalError } from '../domain/error/custom.external.error';
import { ErrorCode } from '../domain/error/error.code';
import { Post } from '../domain/post';

@singleton()
export class PostService {
  private postRepository: Repository<Post>;

  constructor(connection: Connection) {
    this.postRepository = connection.getRepository(Post);
  }

  async getPost(id: string): Promise<Post> {
    try {
      const post = await this.postRepository.findOneOrFail(id);
      return post;
    } catch {
      throw new CustomExternalError([ErrorCode.ARTICLE_NOT_FOUND], 404);
    }
  }

  createPost(newPost: Post): Promise<Post> {
    return this.postRepository.save(newPost);
  }
}
