import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './interfaces/token-payload.interface';
@Injectable()
export class JwtService {
  constructor(
    private readonly jwtNestService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  private calculateExpiresAt(seconds: number): Date {
    return new Date(Date.now() + seconds * 1000);
  }

  signAccessToken(userId: string) {
    const payload: TokenPayload = { sub: userId };
    const expiresIn = parseInt(
      this.configService.getOrThrow<string>('JWT_ACCESS_EXPIRATION_TIME'),
    );
    const secret = this.configService.get<string>('JWT_ACCESS_SECRET');

    const token = this.jwtNestService.sign(payload, {
      secret,
      expiresIn: `${expiresIn}s`,
    });

    return { token, expiresAt: this.calculateExpiresAt(expiresIn) };
  }

  signRefreshToken(userId: string) {
    const payload: TokenPayload = { sub: userId };
    const expiresIn = parseInt(
      this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRATION_TIME'),
    );
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');

    const token = this.jwtNestService.sign(payload, {
      secret,
      expiresIn: `${expiresIn}s`,
    });

    return { token, expiresAt: this.calculateExpiresAt(expiresIn) };
  }

  validateAccessToken(token: string) {
    try {
      return this.jwtNestService.verify<TokenPayload>(token, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  validateRefreshToken(token: string) {
    try {
      return this.jwtNestService.verify<TokenPayload>(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
