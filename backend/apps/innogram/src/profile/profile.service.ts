import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ImageService } from '../image/image.service';
import { FileSubdirectory } from '../file/enum/file.enum';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly imageService: ImageService,
  ) {}

  async createProfile(data: CreateProfileDto) {
    return await this.prisma.profile.create({
      data,
    });
  }

  async getProfile(id: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { user_id: id },
      include: {
        image: {
          include: {
            file: true,
          },
        },
      },
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
    const imageEntity = await this.imageService.uploadImage(
      file,
      filename,
      FileSubdirectory.AVATARS,
    );

    const updatedProfile = await this.updateProfile(id, {
      image_id: imageEntity.id,
    });

    if (profile.image_id) {
      await this.imageService.deleteImage(profile.image_id);
    }

    return updatedProfile;
  }

  async updateProfile(id: string, data: UpdateProfileDto) {
    return await this.prisma.profile.update({ where: { user_id: id }, data });
  }

  async deleteProfile(id: string) {
    return await this.prisma.profile.delete({ where: { user_id: id } });
  }
}
