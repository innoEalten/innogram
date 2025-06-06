import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProfileService } from '../profile.service';
import { CreateProfileDto } from '../dto/create-profile.dto';

@Injectable()
export class UserCreatedListener {
  constructor(private readonly profileService: ProfileService) {}

  @OnEvent('user.created')
  async handleUserCreatedEvent(profileData: CreateProfileDto) {
    await this.profileService.createProfile(profileData);
  }
}
