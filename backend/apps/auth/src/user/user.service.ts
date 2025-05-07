import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserNotFoundException } from './exeptions/userNotFound.exeption';
import { UserWithEmailExistsException } from './exeptions/userWithEmailExists';
import * as bcrypt from 'bcryptjs';
import { VerifyPasswordDto } from './dto/verify-password.dto';
import { InvalidCredentialsException } from './exeptions/invalidCredentials.exeption';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MongoServerError } from 'mongodb';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPass = await bcrypt.hash(createUserDto.password, 10);

    try {
      const user = await this.userModel.create({
        email: createUserDto.email,
        password: hashedPass,
      });

      return user;
    } catch (err) {
      if (err instanceof MongoServerError && err.code === 11000) {
        throw new UserWithEmailExistsException();
      }

      throw err;
    }
  }

  async findAll() {
    return this.userModel.find();
  }

  async findOneById(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async comparePassword(verifyPasswordDto: VerifyPasswordDto) {
    if (!verifyPasswordDto.email || !verifyPasswordDto.password) {
      throw new InvalidCredentialsException();
    }

    const user = await this.userModel.findOne({
      email: verifyPasswordDto.email,
    });

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
    return await this.userModel.findByIdAndUpdate(
      userId,
      {
        refreshToken: {
          token: refreshToken,
          expiresAt: expiresAt,
        },
      },
      { new: true },
    );
  }

  async deleteRefreshToken(userId: string) {
    return await this.userModel.findByIdAndUpdate(
      userId,
      { refreshToken: null },
      { new: true },
    );
  }
}
