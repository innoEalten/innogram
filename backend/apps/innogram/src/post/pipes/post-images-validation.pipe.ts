import {
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';

export const postImagesFileValidationPipe = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
    new FileTypeValidator({ fileType: 'image/*' }),
  ],
  fileIsRequired: true,
});
