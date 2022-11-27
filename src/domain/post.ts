import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type PostCreate = Pick<Post, 'title' | 'author' | 'content'>;

@Entity()
@ObjectType()
export class Post {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field(() => ID)
  id: string;

  @Column({ nullable: false })
  @Field()
  title: string;

  @Column({ nullable: false })
  @Field()
  author: string;

  @Column({ nullable: false, type: 'text' })
  @Field()
  content: string;

  @Field({ nullable: true })
  graphQL?: boolean;

  constructor(args?: { title: string; author: string; content: string }) {
    if (args) {
      this.title = args.title;
      this.author = args.author;
      this.content = args.content;
    }
  }
}
