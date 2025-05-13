import { AUTH_ERROR_MESSAGES } from '@app/shared/constants/auth.constants';
import { UnauthorizedException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

export class InvalidTokenException extends UnauthorizedException {
  constructor() {
    super(AUTH_ERROR_MESSAGES.INVALID_TOKEN);
  }
}

export class WsInvalidTokenException extends WsException {
  constructor() {
    super(AUTH_ERROR_MESSAGES.INVALID_TOKEN);
  }
}
