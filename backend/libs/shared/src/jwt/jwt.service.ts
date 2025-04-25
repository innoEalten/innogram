import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  signAccessToken(userId: string) {
    return this.jwtService.sign(
      { sub: userId },
      {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: `${this.configService.get('JWT_ACCESS_EXPIRATION_TIME')}s`,
      },
    );
  }

  signRefreshToken(userId: string) {
    return this.jwtService.sign(
      { sub: userId },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: `${this.configService.get('JWT_REFRESH_EXPIRATION_TIME')}s`,
      },
    );
  }
}
