import {
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const FILE_TYPE = 'image/*';

export const postImagesFileValidationPipe = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
    new FileTypeValidator({ fileType: FILE_TYPE }),
  ],
  fileIsRequired: true,
});
