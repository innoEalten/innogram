import { ConflictException } from '@nestjs/common';
import { USER_ERROR_MESSAGES } from '@app/shared';

export class UserWithEmailExistsException extends ConflictException {
  constructor() {
    super(USER_ERROR_MESSAGES.USER_WITH_EMAIL_EXISTS);
  }
}
