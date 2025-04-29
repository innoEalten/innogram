import { Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from '@app/shared';

@Injectable()
export class AuthService {
  async register(createUserDto: CreateUserDto) {}

  async login(loginUserDto: LoginUserDto) {}
}
