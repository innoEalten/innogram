import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { SocketWithUser } from '@app/shared/interfaces/socket-user.interface';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { WsInvalidTokenException } from '../exeptions/invalid-token.exeption';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private readonly jwtStrategy: JwtStrategy) {}

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient<SocketWithUser>();
    const token = client.handshake.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new WsInvalidTokenException();
    }

    const user = await this.jwtStrategy.validateRequest(token);
    client.user = user;

    return true;
  }
}
