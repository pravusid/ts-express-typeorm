import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  title: string;

  @Column()
  @IsNotEmpty()
  author: string;

  @Column({ type: 'text' })
  @IsNotEmpty()
  content: string;

  constructor(args?: { title: string; author: string; content: string }) {
    if (args) {
      this.title = args.title;
      this.author = args.author;
      this.content = args.content;
    }
  }
}
