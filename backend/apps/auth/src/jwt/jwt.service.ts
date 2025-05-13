import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './interfaces/token-payload.interface';
import { InvalidCredentialsException } from '../user/exceptions/invalid-credentials.exception';
@Injectable()
export class JwtService {
  private readonly accessTokenExpiresIn: number;
  private readonly accessTokenSecret: string;
  private readonly refreshTokenExpiresIn: number;
  private readonly refreshTokenSecret: string;

  constructor(
    private readonly jwtNestService: NestJwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessTokenExpiresIn = parseInt(
      this.configService.getOrThrow<string>('JWT_ACCESS_EXPIRATION_TIME'),
    );
    this.accessTokenSecret =
      this.configService.getOrThrow<string>('JWT_ACCESS_SECRET');

    this.refreshTokenExpiresIn = parseInt(
      this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRATION_TIME'),
    );
    this.refreshTokenSecret =
      this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');
  }

  private calculateExpiresAt(seconds: number): Date {
    return new Date(Date.now() + seconds * 1000);
  }

  signAccessToken(userId: string) {
    const payload: TokenPayload = { sub: userId };

    const token = this.jwtNestService.sign(payload, {
      secret: this.accessTokenSecret,
      expiresIn: `${this.accessTokenExpiresIn}s`,
    });

    return {
      token,
      expiresAt: this.calculateExpiresAt(this.accessTokenExpiresIn),
    };
  }

  signRefreshToken(userId: string) {
    const payload: TokenPayload = { sub: userId };

    const token = this.jwtNestService.sign(payload, {
      secret: this.refreshTokenSecret,
      expiresIn: `${this.refreshTokenExpiresIn}s`,
    });

    return {
      token,
      expiresAt: this.calculateExpiresAt(this.refreshTokenExpiresIn),
    };
  }

  validateAccessToken(token: string) {
    try {
      return this.jwtNestService.verify<TokenPayload>(token, {
        secret: this.accessTokenSecret,
      });
    } catch {
      throw new InvalidCredentialsException();
    }
  }

  validateRefreshToken(token: string) {
    try {
      return this.jwtNestService.verify<TokenPayload>(token, {
        secret: this.refreshTokenSecret,
      });
    } catch {
      throw new InvalidCredentialsException();
    }
  }
}
