import { Injectable, UnauthorizedException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

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

  async validateRequest<T>(token: string) {
    const response = await firstValueFrom(
      this.httpService.post<T>(
        `${this.authServiceUrl}/validate-token`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    );

    if (!response.data) {
      throw new UnauthorizedException();
    }

    return response.data;
  }
}
