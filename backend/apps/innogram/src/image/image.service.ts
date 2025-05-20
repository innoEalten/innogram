import { Injectable } from '@nestjs/common';
import { FileService } from '../file/file.service';
import { FileSubdirectory } from '../file/enum/file.enum';
import { ImageRepository } from './image.repository';
import { type Image } from '@app/shared';

@Injectable()
export class ImageService {
  constructor(
    private readonly fileService: FileService,
    private readonly imageRepository: ImageRepository,
  ) {}

  async uploadImages(
    files: Express.Multer.File[],
    subdirectory: FileSubdirectory,
    postId?: string,
  ) {
    const uploadedFiles = await this.fileService.uploadFiles(
      files,
      subdirectory,
    );

    return this.imageRepository.createMany(
      uploadedFiles.map((file) => ({
        fileId: file.id,
        postId,
      })),
    );
  }

  deleteImages(images: Image[]) {
    const imageIds = images.map((image) => image.id);
    const filesToDelete = images.map((image) => ({
      id: image.fileId,
      url: image.file.url,
    }));

    return Promise.all([
      this.fileService.deleteFiles(filesToDelete),
      this.imageRepository.deleteMany(imageIds),
    ]);
  }
}
