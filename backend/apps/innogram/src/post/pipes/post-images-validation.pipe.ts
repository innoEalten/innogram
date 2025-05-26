import {
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileConfig } from '@app/shared';

export const postImagesFileValidationPipe = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: FileConfig.MAX_FILE_SIZE }),
    new FileTypeValidator({ fileType: FileConfig.FILE_TYPE }),
  ],
  fileIsRequired: true,
});
