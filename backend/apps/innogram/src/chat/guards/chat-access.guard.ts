import { ExecutionContext } from '@nestjs/common';
import { Injectable, CanActivate } from '@nestjs/common';
import { ChatService } from '../chat.service';
import { SocketWithChatUser } from '../interfaces/socket-chat-user.interface';

@Injectable()
export class ChatAccessGuard implements CanActivate {
  constructor(private readonly chatService: ChatService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<SocketWithChatUser>();
    const chatId = client.handshake.query['chatId'];

    if (!chatId || typeof chatId !== 'string') return false;

    const user = client.user;
    const chat = await this.chatService.getValidatedUserChat(chatId, user._id);

    if (!chat) return false;

    client.chat = chat;

    return true;
  }
}
