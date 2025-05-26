import { Injectable } from '@nestjs/common';
import { FileSubdirectory } from '@app/shared';
import { MinioService } from '../minio/minio.service';
import { FileRepository } from './file.repository';

@Injectable()
export class FileService {
  constructor(
    private readonly minioService: MinioService,
    private readonly fileRepository: FileRepository,
  ) {}

  async uploadFiles(
    files: Express.Multer.File[],
    subdirectory: FileSubdirectory,
  ) {
    const filePaths = await this.minioService.uploadObjects(
      files,
      subdirectory,
    );
    const fileEntities = filePaths.map((filePath) => ({ url: filePath }));
    return this.fileRepository.createMany(fileEntities);
  }

  async deleteFiles(files: { id: string; url: string }[]) {
    await this.minioService.removeObjects(files.map((file) => file.url));
    return this.fileRepository.deleteMany(files.map((file) => file.id));
  }
}
