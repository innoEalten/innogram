import { Injectable } from '@nestjs/common';
import {
  CreateUserDto,
  LoginUserDto,
  RegisterResponseDto,
  LogoutResponseDto,
  LoginResponseDto,
  RefreshTokenResponseDto,
} from '@app/shared';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class AuthService {
  private readonly authServiceUrl: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly profileService: ProfileService,
  ) {
    this.authServiceUrl =
      this.configService.getOrThrow<string>('AUTH_SERVICE_URL');
  }

  async register(createUserDto: CreateUserDto) {
    const response = await firstValueFrom(
      this.httpService.post<RegisterResponseDto>(
        `${this.authServiceUrl}/register`,
        createUserDto,
      ),
    );

    const profile = await this.profileService.createProfile({
      user_id: response.data.user._id,
      name: createUserDto.name,
      phone: createUserDto.phone,
      bio: '',
    });

    return { ...response.data, profile };
  }

  async login(loginUserDto: LoginUserDto) {
    const response = await firstValueFrom(
      this.httpService.post<LoginResponseDto>(
        `${this.authServiceUrl}/login`,
        loginUserDto,
      ),
    );

    const profile = await this.profileService.getProfile(
      response.data.user._id,
    );

    return { ...response.data, profile };
  }

  async logout(token: string) {
    const response = await firstValueFrom(
      this.httpService.post<LogoutResponseDto>(
        `${this.authServiceUrl}/logout`,
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

  async refreshAccessToken(refreshToken: string) {
    const response = await firstValueFrom(
      this.httpService.post<RefreshTokenResponseDto>(
        `${this.authServiceUrl}/refresh-access-token`,
        {
          refreshToken,
        },
      ),
    );
    return response.data;
  }
}
