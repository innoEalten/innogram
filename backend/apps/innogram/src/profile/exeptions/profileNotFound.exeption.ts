import { NotFoundException } from '@nestjs/common';

export class ProfileNotFoundException extends NotFoundException {
  constructor() {
    super('Profile not found');
  }
}
