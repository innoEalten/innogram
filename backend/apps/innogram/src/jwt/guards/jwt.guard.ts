import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../auth/decorators/public.decorator';
import { InvalidTokenException } from '../exceptions/invalid-token.exception';
import { RequestWithUser } from '@app/shared';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtStrategy: JwtStrategy,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractTokenFromHeader(request);

    const user = await this.jwtStrategy.validateRequest(token);
    request.user = user;
    return true;
  }

  private extractTokenFromHeader(req: Request): string {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new InvalidTokenException();
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new InvalidTokenException();
    }

    return token;
  }
}
