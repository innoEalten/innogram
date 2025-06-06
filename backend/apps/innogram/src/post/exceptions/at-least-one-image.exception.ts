import { PostErrorMessages } from '@app/shared';
import { BadRequestException } from '@nestjs/common';

export class AtLeastOneImageException extends BadRequestException {
  constructor() {
    super(PostErrorMessages.AT_LEAST_ONE_IMAGE_REQUIRED);
  }
}
