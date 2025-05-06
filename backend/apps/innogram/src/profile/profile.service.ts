import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async createProfile(data: CreateProfileDto) {
    return await this.prisma.profile.create({
      data,
    });
  }

  async getProfile(id: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { user_id: id },
    });

    if (!profile) {
      return await this.createProfile({
        user_id: id,
        name: '',
        phone: '',
        bio: '',
      });
    }

    return profile;
  }

  async uploadAvatar(id: string, file: Express.Multer.File) {
    const profile = await this.getProfile(id);
    const filename = `${profile.user_id}-${Date.now()}-${file.originalname}`;
    // const url = await this.fileService.uploadFile(filename, file.buffer);
    // return url;
  }

  async updateProfile(id: string, data: UpdateProfileDto) {
    return await this.prisma.profile.update({ where: { user_id: id }, data });
  }

  async deleteProfile(id: string) {
    return await this.prisma.profile.delete({ where: { user_id: id } });
  }
}
