import { Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from '@app/shared';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

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

  async register(createUserDto: CreateUserDto) {
    const response: AxiosResponse<AuthResponse> = await firstValueFrom(
      this.httpService.post(`${this.authServiceUrl}/register`, createUserDto),
    );

    return response.data;
  }

  async login(loginUserDto: LoginUserDto) {
    const response: AxiosResponse<AuthResponse> = await firstValueFrom(
      this.httpService.post(`${this.authServiceUrl}/login`, loginUserDto),
    );

    return response.data;
  }

  async validateAccessToken(token: string) {
    const response: AxiosResponse<{ isValid: boolean }> = await firstValueFrom(
      this.httpService.post(
        `${this.authServiceUrl}/validate-token`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    );

    return response.data.isValid;
  }

  async refreshAccessToken(refreshToken: string) {
    const response: AxiosResponse<AuthResponse> = await firstValueFrom(
      this.httpService.post(`${this.authServiceUrl}/refresh-access-token`, {
        refreshToken,
      }),
    );

    return response.data;
  }
}
