import { Injectable } from '@nestjs/common';
import { FileService } from '../file/file.service';
import { FileSubdirectory } from '../file/enum/file.enum';
import { ImageNotFoundException } from './exeptions/imageNotFound.exeption';
import { ImageRepository } from './image.repository';

@Injectable()
export class ImageService {
  constructor(
    private readonly fileService: FileService,
    private readonly imageRepository: ImageRepository,
  ) {}

  async uploadImage(
    file: Express.Multer.File,
    filename: string,
    subdirectory?: FileSubdirectory,
    postId?: string,
  ) {
    const uploadedFile = await this.fileService.uploadFile(
      file,
      filename,
      subdirectory,
    );

    return this.imageRepository.create(uploadedFile.id, postId);
  }

  async deleteImage(id: string) {
    const image = await this.imageRepository.findOne(id);

    if (!image) {
      throw new ImageNotFoundException();
    }

    await this.fileService.deleteFile(image.fileId);
  }
}
