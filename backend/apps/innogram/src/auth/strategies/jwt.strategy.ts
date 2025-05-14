import { Injectable } from '@nestjs/common';
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

  async validateRequest(token: string): Promise<boolean> {
    const { data: isValid } = await firstValueFrom(
      this.httpService.post<boolean>(
        `${this.authServiceUrl}/validate-token`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    );

    return isValid;
  }
}
