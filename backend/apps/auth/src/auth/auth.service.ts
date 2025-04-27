import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  RefreshToken,
  RefreshTokenDocument,
} from './schemas/refreshToken.schema';
import { CreateUserDto } from '@app/shared';
import { InjectModel } from '@nestjs/mongoose';
import { UserResponseDto } from './dto/user-response.dto';
import { LoginUserDto } from '@app/shared';
import { HttpClientService } from '@app/shared';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
    private readonly httpClientService: HttpClientService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const res = await this.httpClientService.handleRequest(
      this.httpClientService.post<UserResponseDto>(
        'http://localhost:3000/user',
        {
          email: createUserDto.email,
          password: createUserDto.password,
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
