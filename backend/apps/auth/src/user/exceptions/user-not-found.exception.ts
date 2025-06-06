import { UserErrorMessages } from '@app/shared/constants/user.constant';
import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super(UserErrorMessages.USER_NOT_FOUND);
  }
}
