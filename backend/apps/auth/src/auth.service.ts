import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  RefreshToken,
  RefreshTokenDocument,
} from './schemas/refreshToken.schema';
import { RegisterUserDto } from './dto/register-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserResponseDto } from './dto/user-response.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { HttpClientService } from './http-client/http-client.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
    private readonly httpClientService: HttpClientService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const res = await this.httpClientService.handleRequest(
      this.httpClientService.post<UserResponseDto>(
        'http://localhost:3000/user',
        {
          email: registerUserDto.email,
          password: registerUserDto.password,
        },
      ),
    );

    return res.data;
  }

  async login(loginUserDto: LoginUserDto) {
    const res = await this.httpClientService.handleRequest(
      this.httpClientService.post<UserResponseDto>(
        'http://localhost:3000/user/verify-password',
        {
          email: loginUserDto.email,
          password: loginUserDto.password,
        },
      ),
    );

    return res.data;
  }
}
