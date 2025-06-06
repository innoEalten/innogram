import { Injectable } from '@nestjs/common';
import { FileService } from '../file';
import { type Image, FileSubdirectory } from '@app/shared';
import { ImageRepository } from './image.repository';
import { ImageNotFoundException } from './exceptions';

@Injectable()
export class ImageService {
  constructor(
    private readonly fileService: FileService,
    private readonly imageRepository: ImageRepository,
  ) {}

  async findOne(imageId: string) {
    const image = await this.imageRepository.findOne(imageId);

    if (!image) {
      throw new ImageNotFoundException();
    }

    return image;
  }

  async uploadImage(
    file: Express.Multer.File,
    subdirectory: FileSubdirectory,
    postId?: string,
  ) {
    const tmpUploadedFile = await this.fileService.uploadTmpFile(
      file,
      subdirectory,
    );

    return this.imageRepository.create({
      fileId: tmpUploadedFile.id,
      postId,
    });
  }

  async uploadImages(
    files: Express.Multer.File[],
    subdirectory: FileSubdirectory,
    postId?: string,
  ) {
    const tmpUploadedFiles = await this.fileService.uploadTmpFiles(
      files,
      subdirectory,
    );

    return this.imageRepository.createMany(
      tmpUploadedFiles.map((tmpFile) => ({
        fileId: tmpFile.id,
        postId,
      })),
    );
  }

  deleteImage(image: Image) {
    return Promise.all([
      this.fileService.addFileToDelete(image.file),
      this.imageRepository.delete(image.id),
    ]);
  }

  deleteImages(images: Image[]) {
    const imageIds = images.map((image) => image.id);
    const filesToDelete = images.map((image) => image.file);

    return Promise.all([
      this.fileService.addFilesToDelete(filesToDelete),
      this.imageRepository.deleteMany(imageIds),
    ]);
  }
}
