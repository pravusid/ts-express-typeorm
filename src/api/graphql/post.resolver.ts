import { singleton } from 'tsyringe';
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, ResolverInterface, Root } from 'type-graphql';
import { GraphQLContext } from '../../config/context';
import { Post } from '../../domain/post';
import { logger } from '../../lib/logger';
import { PostService } from '../../service/post.service';
import { PostCreateInput, PostCreatePayload } from './post.input';

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

  @Mutation(() => PostCreatePayload)
  async createPost(@Arg('input') input: PostCreateInput) {
    const { id } = await this.postService.createPost(input);
    return { id };
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
