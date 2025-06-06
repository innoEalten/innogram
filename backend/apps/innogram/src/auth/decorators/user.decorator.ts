import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from '@app/shared';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
