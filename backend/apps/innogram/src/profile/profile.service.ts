import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ImageService } from '../image/image.service';
import { FileSubdirectory } from '@app/shared';
import { ProfileNotFoundException } from './exceptions/profile-not-found.exception';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly imageService: ImageService,
  ) {}

  createProfile(data: CreateProfileDto) {
    return this.profileRepository.create(data);
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

    const imageEntity = await this.imageService.uploadImage(
      file,
      FileSubdirectory.AVATARS,
    );

    const updatedProfile = await this.profileRepository.update(id, {
      imageId: imageEntity.id,
    });

    if (profile.image) {
      await this.imageService.deleteImage(profile.image);
    }

    return updatedProfile;
  }

  updateProfile(id: string, data: UpdateProfileDto) {
    return this.profileRepository.update(id, data);
  }

  deleteProfile(id: string) {
    return this.profileRepository.delete(id);
  }
}
