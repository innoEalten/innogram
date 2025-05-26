import { AUTH_ERROR_MESSAGES } from '@app/shared/constants/auth.constants';
import { UnauthorizedException } from '@nestjs/common';

export class InvalidTokenException extends UnauthorizedException {
  constructor() {
    super(AUTH_ERROR_MESSAGES.INVALID_TOKEN);
  }
}
