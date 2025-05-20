import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ImageService } from '../image/image.service';
import { FileSubdirectory } from '../file/enum/file.enum';
import { ProfileNotFoundException } from './exeptions/profileNotFound.exeption';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly imageService: ImageService,
  ) {}

  async createProfile(data: CreateProfileDto) {
    return await this.profileRepository.create(data);
  }

  async getProfile(id: string) {
    const profile = await this.profileRepository.findOne(id);

    if (!profile) {
      throw new ProfileNotFoundException();
    }

    return profile;
  }

  async uploadAvatar(id: string, file: Express.Multer.File) {
    const profile = await this.getProfile(id);

    const [imageEntity] = await this.imageService.uploadImages(
      [file],
      FileSubdirectory.AVATARS,
    );

    if (!imageEntity) {
      throw new Error('Failed to upload image');
    }

    const updatedProfile = await this.profileRepository.update(id, {
      imageId: imageEntity.id,
    });

    if (profile.image) {
      await this.imageService.deleteImages([profile.image]);
    }

    return updatedProfile;
  }

  async updateProfile(id: string, data: UpdateProfileDto) {
    return await this.profileRepository.update(id, data);
  }

  async deleteProfile(id: string) {
    return await this.profileRepository.delete(id);
  }
}
