import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type PostCreateInput = Pick<Post, 'title' | 'author' | 'content'>;

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  author: string;

  @Column({ nullable: false, type: 'text' })
  content: string;

  constructor(args?: { title: string; author: string; content: string }) {
    if (args) {
      this.title = args.title;
      this.author = args.author;
      this.content = args.content;
    }
  }
}
