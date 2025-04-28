import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async createProfile(data: CreateProfileDto) {
    return await this.prisma.profile.create({ data });
  }

  async getProfile(id: number) {
    return await this.prisma.profile.findUnique({ where: { user_id: id } });
  }

  async updateProfile(id: number, data: UpdateProfileDto) {
    return await this.prisma.profile.update({ where: { user_id: id }, data });
  }

  async deleteProfile(id: number) {
    return await this.prisma.profile.delete({ where: { user_id: id } });
  }
}
