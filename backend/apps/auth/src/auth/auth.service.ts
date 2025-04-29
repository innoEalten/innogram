import { Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from '@app/shared';

@Injectable()
export class AuthService {
  constructor() {}

  async register(createUserDto: CreateUserDto) {}

  async login(loginUserDto: LoginUserDto) {}

  async validateAccessToken(accessToken: string) {}
}
