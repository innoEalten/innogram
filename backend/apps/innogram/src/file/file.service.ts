import { Injectable } from '@nestjs/common';
import { FileSubdirectory } from '@app/shared';
import { MinioService } from '../minio/minio.service';
import { FileRepository } from './file.repository';
import { type Image } from '@app/shared';

@Injectable()
export class FileService {
  constructor(
    private readonly minioService: MinioService,
    private readonly fileRepository: FileRepository,
  ) {}

  async uploadFile(file: Express.Multer.File, subdirectory: FileSubdirectory) {
    const uploadedFilePath = await this.minioService.uploadObject(
      file,
      subdirectory,
    );

    return this.fileRepository.create({
      url: uploadedFilePath,
    });
  }

  async uploadFiles(
    files: Express.Multer.File[],
    subdirectory: FileSubdirectory,
  ) {
    const uploadedFilePaths = await this.minioService.uploadObjects(
      files,
      subdirectory,
    );

    const fileEntities = uploadedFilePaths.map((filePath) => ({
      url: filePath,
    }));

    return this.fileRepository.createMany(fileEntities);
  }

  async deleteFile(file: Image['file']) {
    await this.minioService.removeObject(file.url);
    return this.fileRepository.delete(file.id);
  }

  async deleteFiles(files: Image['file'][]) {
    await this.minioService.removeObjects(files.map((file) => file.url));
    return this.fileRepository.deleteMany(files.map((file) => file.id));
  }
}
