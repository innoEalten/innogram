import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ValidateTokenResponseDto } from '@app/shared/dto/auth-response.dto';
import { SocketWithUser } from '@app/shared/interfaces/socket-user.interface';

export const WsUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ValidateTokenResponseDto => {
    const client = ctx.switchToWs().getClient<SocketWithUser>();
    return client.user;
  },
);
