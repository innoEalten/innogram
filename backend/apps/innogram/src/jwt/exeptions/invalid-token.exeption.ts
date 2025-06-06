import { AuthErrorMessages } from '@app/shared';
import { UnauthorizedException } from '@nestjs/common';

export class InvalidTokenException extends UnauthorizedException {
  constructor() {
    super(AuthErrorMessages.INVALID_TOKEN);
  }
}
