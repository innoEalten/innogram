import { Injectable } from '@nestjs/common';
import { FileService } from '../file/file.service';
import { type Image, FileSubdirectory } from '@app/shared';
import { ImageRepository } from './image.repository';

@Injectable()
export class ImageService {
  constructor(
    private readonly fileService: FileService,
    private readonly imageRepository: ImageRepository,
  ) {}

  async uploadImage(
    file: Express.Multer.File,
    subdirectory: FileSubdirectory,
    postId?: string,
  ) {
    const uploadedFile = await this.fileService.uploadFile(file, subdirectory);

    return this.imageRepository.create({
      fileId: uploadedFile.id,
      postId,
    });
  }

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

  deleteImage(image: Image) {
    return Promise.all([
      this.fileService.deleteFile(image.file),
      this.imageRepository.delete(image.id),
    ]);
  }

  deleteImages(images: Image[]) {
    const imageIds = images.map((image) => image.id);
    const filesToDelete = images.map((image) => image.file);

    return Promise.all([
      this.fileService.deleteFiles(filesToDelete),
      this.imageRepository.deleteMany(imageIds),
    ]);
  }
}
