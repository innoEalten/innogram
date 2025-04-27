import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtService } from '../../../../../libs/shared/src/jwt/jwt.service';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '../../../../../libs/shared/src/jwt/interfaces/token-payload.interface';
import { HttpClientService } from '@app/shared/http-client/http-client.service';
import { UserResponseDto } from 'apps/auth/src/auth/dto/user-response.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly httpClientService: HttpClientService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_ACCESS_SECRET') as string,
    });
  }

  async validate(payload: TokenPayload) {
    const res = await this.httpClientService.handleRequest(
      this.httpClientService.get<UserResponseDto>(
        `http://localhost:3000/user/${payload.sub}`,
      ),
    );

    return res.data;
  }
}
