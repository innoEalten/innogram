import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { FileService } from '../file/file.service';
import { FileSubdirectory } from '../file/enum/file.enum';

@Injectable()
export class ImageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async uploadImage(
    file: Express.Multer.File,
    filename: string,
    subdirectory?: FileSubdirectory,
  ) {
    const uploaded_file = await this.fileService.uploadFile(
      file,
      filename,
      subdirectory,
    );

    return this.prisma.image.create({
      data: { file_id: uploaded_file.id },
    });
  }
}
