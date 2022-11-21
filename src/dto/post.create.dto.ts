import { IsNotEmpty } from 'class-validator';
import { PostCreateInput } from '../domain/post';
import { BaseDto } from './base.dto';

export class PostCreateDto extends BaseDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  author: string;

  @IsNotEmpty()
  content: string;

  toEntity(): PostCreateInput {
    return {
      title: this.title,
      author: this.author,
      content: this.content,
    };
  }
}
