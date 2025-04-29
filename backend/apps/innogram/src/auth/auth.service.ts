import { Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from '@app/shared';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly authServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.authServiceUrl =
      this.configService.getOrThrow<string>('AUTH_SERVICE_URL');
  }

  async register<T>(createUserDto: CreateUserDto) {
    const response = await firstValueFrom(
      this.httpService.post<T>(
        `${this.authServiceUrl}/register`,
        createUserDto,
      ),
    );
    return response.data;
  }

  async login<T>(loginUserDto: LoginUserDto) {
    const response = await firstValueFrom(
      this.httpService.post<T>(`${this.authServiceUrl}/login`, loginUserDto),
    );
    return response.data;
  }

  async validateAccessToken<T>(token: string) {
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
    return response.data;
  }

  async refreshAccessToken<T>(refreshToken: string) {
    const response = await firstValueFrom(
      this.httpService.post<T>(`${this.authServiceUrl}/refresh-access-token`, {
        refreshToken,
      }),
    );
    return response.data;
  }
}
