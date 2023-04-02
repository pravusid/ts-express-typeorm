import { Field, ID, InputType, ObjectType } from 'type-graphql';
import { Post, PostCreate } from '../../domain/post.js';

@InputType()
export class PostCreateInput implements PostCreate {
  @Field()
  title: string;

  @Field()
  author: string;

  @Field()
  content: string;
}

@ObjectType()
export class PostCreatePayload implements Pick<Post, 'id'> {
  @Field(() => ID)
  id: string;
}
