import { USER_ERROR_MESSAGES } from '@app/shared/constants/user.constraints';
import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super(USER_ERROR_MESSAGES.USER_NOT_FOUND);
  }
}
