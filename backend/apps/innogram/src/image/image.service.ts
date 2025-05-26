import { Injectable } from '@nestjs/common';
import { FileService } from '../file/file.service';
import { type Image, FileSubdirectory, hasItems } from '@app/shared';
import { ImageRepository } from './image.repository';

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
    if (!hasItems(files)) {
      return [];
    }

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
    if (!hasItems(images)) {
      return Promise.resolve();
    }

    const imageIds = images.map((image) => image.id);
    const filesToDelete = images.map((image) => image.file);

    return Promise.all([
      this.fileService.deleteFiles(filesToDelete),
      this.imageRepository.deleteMany(imageIds),
    ]);
  }
}
