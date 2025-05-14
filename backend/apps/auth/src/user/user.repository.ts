import { Injectable } from '@nestjs/common';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from '@app/shared/dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  async findAll() {
    return this.userModel.find();
  }

  async findOneById(id: string) {
    return this.userModel.findById(id);
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async setRefreshToken(userId: string, refreshToken: string, expiresAt: Date) {
    return this.userModel.findByIdAndUpdate(
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
    return this.userModel.findByIdAndUpdate(
      userId,
      { refreshToken: null },
      { new: true },
    );
  }
}
