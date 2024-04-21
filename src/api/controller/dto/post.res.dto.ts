import { Post } from '../../../domain/post.js';

export class PostResDto {
  private constructor(
    public id: string,
    public title: string,
    public author: string,
    public content: string,
  ) {}

  static fromEntity(e: Post): PostResDto {
    return new PostResDto(e.id, e.title, e.author, e.content);
  }
}
