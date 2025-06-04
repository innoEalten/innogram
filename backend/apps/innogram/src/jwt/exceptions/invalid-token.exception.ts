import { AuthErrorMessages } from '@app/shared';
import { UnauthorizedException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

export class InvalidTokenException extends UnauthorizedException {
  constructor() {
    super(AuthErrorMessages.INVALID_TOKEN);
  }
}

export class WsInvalidTokenException extends WsException {
  constructor() {
    super(AuthErrorMessages.INVALID_TOKEN);
  }
}
