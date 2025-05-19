import { BadRequestException } from '@nestjs/common';
import { AUTH_ERROR_MESSAGES } from '@app/shared/constants/auth.constants';

export class InvalidCredentialsException extends BadRequestException {
  constructor() {
    super(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
  }
}
