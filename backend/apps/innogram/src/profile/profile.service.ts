import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async createProfile(data: CreateProfileDto) {
    return this.prisma.profile.create({
      data,
    });
  }

  async getProfile(id: string) {
    return this.prisma.profile.findUnique({ where: { userId: id } });
  }

  async updateProfile(id: string, data: UpdateProfileDto) {
    return this.prisma.profile.update({ where: { userId: id }, data });
  }

  async deleteProfile(id: string) {
    return this.prisma.profile.delete({ where: { userId: id } });
  }
}
