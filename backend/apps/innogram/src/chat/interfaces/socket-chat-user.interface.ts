import { SocketWithUser } from '@app/shared/interfaces/socket-user.interface';
import { Chat } from '@prisma/client';

export interface SocketWithChatUser extends SocketWithUser {
  chat: Chat;
}
