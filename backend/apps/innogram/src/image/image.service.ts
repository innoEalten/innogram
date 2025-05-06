import { Injectable, NotFoundException } from '@nestjs/common';
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

  async deleteImage(image_id: string) {
    const image = await this.prisma.image.findUnique({
      where: { id: image_id },
      include: { file: true },
    });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    await this.prisma.image.delete({ where: { id: image_id } });
    await this.fileService.deleteFile(image.file_id);
  }
}
