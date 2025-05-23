import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@app/shared/dto/create-user.dto';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto);
  }

  async findAll() {
    return this.userRepository.findAll();
  }

  async findOneById(id: string) {
    const user = await this.userRepository.findOneById(id);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async findOneByEmail(email: string) {
    return this.userRepository.findOneByEmail(email);
  }

  async setRefreshToken(userId: string, refreshToken: string, expiresAt: Date) {
    return this.userRepository.setRefreshToken(userId, refreshToken, expiresAt);
  }

  async deleteRefreshToken(userId: string) {
    return this.userRepository.deleteRefreshToken(userId);
  }
}
