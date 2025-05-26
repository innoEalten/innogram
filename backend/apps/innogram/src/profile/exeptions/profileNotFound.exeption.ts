import { NotFoundException } from '@nestjs/common';
import { ProfileErrorMessages } from '@app/shared';

export class ProfileNotFoundException extends NotFoundException {
  constructor() {
    super(ProfileErrorMessages.PROFILE_NOT_FOUND);
  }
}
