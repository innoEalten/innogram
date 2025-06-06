import { NotFoundException } from '@nestjs/common';
import { PostErrorMessages } from '@app/shared/constants';

export class PostNotFoundException extends NotFoundException {
  constructor() {
    super(PostErrorMessages.POST_NOT_FOUND);
  }
}
