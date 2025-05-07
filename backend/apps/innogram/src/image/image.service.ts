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
    post_id?: string,
  ) {
    const uploaded_file = await this.fileService.uploadFile(
      file,
      filename,
      subdirectory,
    );

    return this.imageRepository.create(uploaded_file.id, post_id);
  }

  async deleteImage(id: string) {
    const image = await this.imageRepository.findOne(id);

    if (!image) {
      throw new ImageNotFoundException();
    }

    await this.imageRepository.delete(id);
    await this.fileService.deleteFile(image.file_id);
  }
}
