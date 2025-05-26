import { UnauthorizedException } from '@nestjs/common';
import { AuthErrorMessages } from '@app/shared';

export class InvalidCredentialsException extends UnauthorizedException {
  constructor() {
    super(AuthErrorMessages.INVALID_CREDENTIALS);
  }
}
