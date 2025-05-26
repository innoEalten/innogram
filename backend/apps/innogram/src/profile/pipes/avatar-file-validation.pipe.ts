import { ParseFilePipe } from '@nestjs/common';
import { MaxFileSizeValidator } from '@nestjs/common';
import { FileTypeValidator } from '@nestjs/common';

const MAX_FILE_SIZE = 1024 * 1024 * 2;
const FILE_TYPE = 'image/*';

export const avatarFileValidationPipe = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
    new FileTypeValidator({ fileType: FILE_TYPE }),
  ],
  fileIsRequired: true,
});
