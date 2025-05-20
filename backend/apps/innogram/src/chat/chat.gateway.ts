import { Logger, UseGuards, UsePipes } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  SubscribeMessage,
  ConnectedSocket,
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
import { SendMessageDto } from './dto/send-message.dto';
import { WSValidationPipe } from './pipes/ws-validation.pipe';

@UseGuards(WsAuthGuard)
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
        .then(() => {
          next();
        })
        .catch(() => next(new WsInvalidTokenException()));
    });
  }

  @SubscribeMessage('join_chat')
  @UseGuards(ChatAccessGuard)
  async handleJoinChat(
    @ConnectedSocket() client: Socket,
    @WsChat() chat: Chat,
  ) {
    this.logger.log(`WsUser ${client.id} joined chat ${chat.id}`);
    return client.join(chat.id);
  }

  @SubscribeMessage('send_message')
  @UseGuards(ChatAccessGuard)
  @UsePipes(new WSValidationPipe())
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() { message }: SendMessageDto,
    @WsUser() user: UserType,
    @WsChat() chat: Chat,
  ) {
    this.logger.log(`User ${user._id} sent message ${message}`);

    const createdMessage = await this.chatService.createMessage(
      chat.id,
      user._id,
      message,
    );

    this.server.to(chat.id).emit('receive_message', createdMessage);

    return createdMessage;
  }
}
