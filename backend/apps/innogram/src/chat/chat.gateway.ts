import { Logger, UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  SubscribeMessage,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WsAuthGuard } from '../jwt/guards/ws-jwt.guard';
import { WsInvalidTokenException } from '../jwt/exeptions/invalid-token.exeption';
import { JwtStrategy } from '../jwt/strategies/jwt.strategy';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly logger: Logger,
    private readonly jwtStrategy: JwtStrategy,
  ) {}

  afterInit(@ConnectedSocket() server: Server) {
    server.use((packet, next) => {
      const token = packet.handshake?.headers?.authorization?.split(' ')[1];

      if (!token) {
        return next(new WsInvalidTokenException());
      }

      this.jwtStrategy
        .validateRequest(token)
        .then(() => next())
        .catch(() => next(new WsInvalidTokenException()));
    });
  }

  @SubscribeMessage('send_message')
  @UseGuards(WsAuthGuard)
  handleMessage(@MessageBody() message: string) {
    this.logger.log(message);
    this.server.emit('receive_message', message);
  }
}
