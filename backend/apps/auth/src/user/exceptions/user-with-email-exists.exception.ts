import { ConflictException } from '@nestjs/common';
import { UserErrorMessages } from '@app/shared';

export class UserWithEmailExistsException extends ConflictException {
  constructor() {
    super(UserErrorMessages.USER_WITH_EMAIL_EXISTS);
  }
}
