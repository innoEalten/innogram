import { SocketWithUser } from '../../auth/interfaces/socket-user.interface';
import { Chat } from '@prisma/client';

export interface SocketWithChatUser extends SocketWithUser {
  chat: Chat;
}
