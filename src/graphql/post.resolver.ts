import { singleton } from 'tsyringe';
import { Arg, Ctx, FieldResolver, Query, Resolver, ResolverInterface, Root } from 'type-graphql';
import { Post } from '../domain/post';
import { logger } from '../lib/logger';
import { PostService } from '../service/post.service';
import { GraphQLContext } from './context';

@singleton()
@Resolver()
export class PostResolver {
  constructor(private postService: PostService) {}

  @Query(() => Post)
  async post(@Arg('id') id: string, @Ctx() ctx: GraphQLContext) {
    logger.debug(ctx, 'GraphQL Context');

    const post = await this.postService.getPost(id);
    return post;
  }
}

@singleton()
@Resolver(() => Post)
export class PostFieldResolver implements ResolverInterface<Post> {
  @FieldResolver()
  graphQL(@Root() root: Post) {
    return true;
  }
}
