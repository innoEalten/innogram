import { NotFoundException } from '@nestjs/common';
import { POST_ERROR_MESSAGES } from '@app/shared/constants/post.constants';

export class PostNotFoundException extends NotFoundException {
  constructor() {
    super(POST_ERROR_MESSAGES.POST_NOT_FOUND);
  }
}

export class PostsNotFoundException extends NotFoundException {
  constructor() {
    super(POST_ERROR_MESSAGES.POSTS_NOT_FOUND);
  }
}
