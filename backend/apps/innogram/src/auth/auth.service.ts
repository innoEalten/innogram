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
    const {
      data: { user, tokens },
    } = await firstValueFrom(
      this.httpService.post<RegisterResponseDto>(
        `${this.authServiceUrl}/register`,
        createUserDto,
      ),
    );

    const profile = await this.profileService.createProfile({
      user_id: user._id,
      name: createUserDto.name,
      phone: createUserDto.phone,
      bio: '',
    });

    return { user, profile, tokens };
  }

  async login(loginUserDto: LoginUserDto) {
    const {
      data: { user, tokens },
    } = await firstValueFrom(
      this.httpService.post<LoginResponseDto>(
        `${this.authServiceUrl}/login`,
        loginUserDto,
      ),
    );

    const profile = await this.profileService.getProfile(user._id);

    return { user, profile, tokens };
  }

  async logout(token: string) {
    const { data } = await firstValueFrom(
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

    return data;
  }

  async refreshAccessToken(refreshToken: string) {
    const {
      data: { tokens },
    } = await firstValueFrom(
      this.httpService.post<RefreshTokenResponseDto>(
        `${this.authServiceUrl}/refresh-access-token`,
        {
          refreshToken,
        },
      ),
    );

    return tokens;
  }
}
