import { Logger, UseGuards, UsePipes } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  SubscribeMessage,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsAuthGuard } from '../jwt/guards/ws-jwt.guard';
import { WsInvalidTokenException } from '../jwt/exeptions/invalid-token.exeption';
import { JwtStrategy } from '../jwt/strategies/jwt.strategy';
import { ChatService } from './chat.service';
import { WsUser } from '../auth/decorators/ws-user.decorator';
import { User as UserType } from '@app/shared';
import { ChatAccessGuard } from './guards/chat-access.guard';
import { WsChat } from './decorators/chat.decorator';
import { Chat } from '@prisma/client';
import { SocketWithChatUser } from './interfaces/socket-chat-user.interface';
import { CHAT_ERROR_MESSAGES } from '@app/shared/constants/chat.constants';
import { SendMessageDto, sendMessageSchema } from './dto/send-message.dto';
import { JoiValidationPipe } from './pipes/joi-validation.pipe';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly logger: Logger,
    private readonly jwtStrategy: JwtStrategy,
    private readonly chatService: ChatService,
  ) {}

  afterInit(@ConnectedSocket() server: Server) {
    server.use((packet, next) => {
      const token = packet.handshake?.headers?.authorization?.split(' ')[1];

      if (!token) {
        return next(new WsInvalidTokenException());
      }

      this.jwtStrategy
        .validateRequest(token)
        .then(async (user) => {
          const client = packet as unknown as SocketWithChatUser;

          const chatId = client.handshake.query['chatId'];

          if (!chatId || typeof chatId !== 'string') {
            return next(new WsException(CHAT_ERROR_MESSAGES.INVALID_CHAT_ID));
          }

          return this.chatService.getValidatedUserChat(chatId, user._id);
        })
        .then((chat) => {
          if (!chat) {
            return next(new WsException(CHAT_ERROR_MESSAGES.ACCESS_DENIED));
          }

          next();
        })
        .catch(() => next(new WsInvalidTokenException()));
    });
  }

  @SubscribeMessage('join_chat')
  @UseGuards(WsAuthGuard, ChatAccessGuard)
  async handleJoinChat(
    @ConnectedSocket() client: Socket,
    @WsChat() chat: Chat,
  ) {
    this.logger.log(`User ${client.id} joined chat ${chat.id}`);
    return client.join(chat.id);
  }

  @SubscribeMessage('send_message')
  @UseGuards(WsAuthGuard, ChatAccessGuard)
  @UsePipes(new JoiValidationPipe(sendMessageSchema))
  async handleMessage(
    @MessageBody() { message }: SendMessageDto,
    @WsUser() user: UserType,
    @WsChat() chat: Chat,
  ) {
    this.logger.log(message);
    const mes = await this.chatService.createMessage(
      chat.id,
      user._id,
      message,
    );

    this.server.to(chat.id).emit('receive_message', mes);

    return message;
  }
}
