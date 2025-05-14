import { Injectable } from '@nestjs/common';
import {
  CreateUserWithProfileDto,
  LoginUserDto,
  RegisterResponseDto,
  LogoutResponseDto,
  LoginResponseDto,
  RefreshTokenResponseDto,
} from '@app/shared';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateUserDto } from '@app/shared/dto/create-user.dto';
import { CreateProfileDto } from '../profile/dto/create-profile.dto';

@Injectable()
export class AuthService {
  private readonly authServiceUrl: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.authServiceUrl =
      this.configService.getOrThrow<string>('AUTH_SERVICE_URL');
  }

  async register(createUserDto: CreateUserWithProfileDto) {
    const user: CreateUserDto = {
      email: createUserDto.email,
      password: createUserDto.password,
    };

    const {
      data: { user: createdUser, tokens },
    } = await firstValueFrom(
      this.httpService.post<RegisterResponseDto>(
        `${this.authServiceUrl}/register`,
        user,
      ),
    );

    const profileData: CreateProfileDto = {
      userId: createdUser._id,
      name: createUserDto.name,
      phone: createUserDto.phone,
      bio: '',
    };

    this.eventEmitter.emit('user.created', profileData);

    return { user, tokens };
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

    return { user, tokens };
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
