import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  RefreshToken,
  RefreshTokenDocument,
} from './schemas/refreshToken.schema';
import { CreateUserDto } from '@app/shared';
import { InjectModel } from '@nestjs/mongoose';
import { UserResponseDto } from './dto/user-response.dto';
import { HttpClientService } from '@app/shared';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
    private readonly httpClientService: HttpClientService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const res = await this.httpClientService.post<UserResponseDto>(
      'http://localhost:3000/user',
      {
        email: createUserDto.email,
        password: createUserDto.password,
      },
    );

    return res.data;
  }

  async validateUser(email: string, password: string) {
    const res = await this.httpClientService.post<UserResponseDto>(
      'http://localhost:3000/user/verify-password',
      {
        email,
        password,
      },
    );

    return res.data;
  }
}
