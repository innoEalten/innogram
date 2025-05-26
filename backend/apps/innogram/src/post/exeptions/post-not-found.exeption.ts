import { NotFoundException } from '@nestjs/common';
import { POST_ERROR_MESSAGES } from '@app/shared/constants/post.constraints';

export class PostNotFoundException extends NotFoundException {
  constructor() {
    super(POST_ERROR_MESSAGES.POST_NOT_FOUND);
  }
}
