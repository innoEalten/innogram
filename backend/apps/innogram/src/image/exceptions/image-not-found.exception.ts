import { NotFoundException } from '@nestjs/common';
import { ImageErrorMessages } from '@app/shared';

export class ImageNotFoundException extends NotFoundException {
  constructor() {
    super(ImageErrorMessages.IMAGE_NOT_FOUND);
  }
}
