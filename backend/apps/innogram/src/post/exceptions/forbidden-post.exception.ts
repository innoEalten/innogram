import { ForbiddenException } from '@nestjs/common';
import { PostErrorMessages } from '@app/shared';

export class ForbiddenPostException extends ForbiddenException {
  constructor() {
    super(PostErrorMessages.FORBIDDEN_POST);
  }
}
