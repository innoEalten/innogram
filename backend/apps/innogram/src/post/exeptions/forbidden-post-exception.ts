import { ForbiddenException } from '@nestjs/common';

export class ForbiddenPostException extends ForbiddenException {
  constructor() {
    super('You are not allowed to perform operations on this post');
  }
}
