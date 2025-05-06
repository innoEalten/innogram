import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { FileService } from '../file/file.service';

@Injectable()
export class ImageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async uploadImage(file: Express.Multer.File, filename: string) {
    const uploaded_file = await this.fileService.uploadFile(file, filename);

    return this.prisma.image.create({
      data: { file_id: uploaded_file.id },
    });
  }
}
