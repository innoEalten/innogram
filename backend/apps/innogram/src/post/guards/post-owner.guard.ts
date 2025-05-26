import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PostService } from '../post.service';
import { ForbiddenPostException } from '../exeptions';
import { RequestWithUser } from '@app/shared';

@Injectable()
export class PostOwnerGuard implements CanActivate {
  constructor(private readonly postService: PostService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    const postId = request.params['id'];

    if (!user || !postId) {
      throw new ForbiddenPostException();
    }

    const post = await this.postService.findOne(postId);

    if (post.author.userId !== user._id) {
      throw new ForbiddenPostException();
    }

    return true;
  }
}
