import { ForbiddenException } from '@nestjs/common';
import { POST_ERROR_MESSAGES } from '@app/shared';

export class ForbiddenPostException extends ForbiddenException {
  constructor() {
    super(POST_ERROR_MESSAGES.FORBIDDEN_POST);
  }
}
