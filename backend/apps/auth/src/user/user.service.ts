import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../../../libs/shared/src/dto/create-user.dto';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { UserWithEmailExistsException } from './exceptions/user-with-email-exists.exception';
import * as bcrypt from 'bcryptjs';
import { VerifyPasswordDto } from './dto/verify-password.dto';
import { InvalidCredentialsException } from './exceptions/invalid-credentials.exception';
import { MongoServerError } from 'mongodb';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    try {
      console.log(createUserDto);
      const user = await this.userRepository.create(createUserDto);

      return user;
    } catch (err) {
      if (err instanceof MongoServerError && err.code === 11000) {
        throw new UserWithEmailExistsException();
      }

      throw err;
    }
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

  async comparePassword(verifyPasswordDto: VerifyPasswordDto) {
    const user = await this.userRepository.findOneByEmail(
      verifyPasswordDto.email,
    );

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const isPasswordCorrect = await bcrypt.compare(
      verifyPasswordDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new InvalidCredentialsException();
    }

    return user;
  }

  async setRefreshToken(userId: string, refreshToken: string, expiresAt: Date) {
    return this.userRepository.setRefreshToken(userId, refreshToken, expiresAt);
  }

  async deleteRefreshToken(userId: string) {
    return this.userRepository.deleteRefreshToken(userId);
  }
}
