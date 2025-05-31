import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ValidateTokenResponseDto } from '@app/shared/dto/auth-response.dto';
import { InvalidTokenException } from '../exceptions/invalid-token.ecxeption';

@Injectable()
export class JwtStrategy {
  private readonly authServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.authServiceUrl =
      this.configService.getOrThrow<string>('AUTH_SERVICE_URL');
  }

  async validateRequest(token: string) {
    const { data } = await firstValueFrom(
      this.httpService.post<ValidateTokenResponseDto>(
        `${this.authServiceUrl}/validate-token`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    );

    if (!data) {
      throw new InvalidTokenException();
    }

    return data;
  }
}
