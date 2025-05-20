import { UnauthorizedException } from '@nestjs/common';
import { AUTH_ERROR_MESSAGES } from '@app/shared/constants/auth.constants';

export class InvalidCredentialsException extends UnauthorizedException {
  constructor() {
    super(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
  }
}
