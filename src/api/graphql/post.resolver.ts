import { injectable } from 'inversify';
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, ResolverInterface, Root } from 'type-graphql';
import { GraphQLContext } from '../../config/context.js';
import { Post } from '../../domain/post.js';
import { logger } from '../../lib/logger.js';
import { PostService } from '../../service/post.service.js';
import { PostCreateInput, PostCreatePayload } from './post.input.js';

@injectable()
@Resolver()
export class PostResolver {
  constructor(private postService: PostService) {}

  @Query(() => Post)
  async post(@Arg('id') id: string, @Ctx() ctx: GraphQLContext): Promise<Post> {
    logger.debug(ctx, 'GraphQL Context');

    const post = await this.postService.getPost(id);

    return post;
  }

  @Mutation(() => PostCreatePayload)
  async createPost(@Arg('input') input: PostCreateInput): Promise<{ id: string }> {
    const { id } = await this.postService.createPost(input);

    return { id };
  }
}

@injectable()
@Resolver(() => Post)
export class PostFieldResolver implements ResolverInterface<Post> {
  @FieldResolver()
  graphQL(@Root() root: Post) {
    return true;
  }
}
