import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SocketWithChatUser } from '../interfaces/socket-chat-user.interface';

export const WsChat = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const client = ctx.switchToWs().getClient<SocketWithChatUser>();
    return client.chat;
  },
);
