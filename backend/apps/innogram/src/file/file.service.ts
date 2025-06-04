import { Injectable } from '@nestjs/common';
import { FileSubdirectory } from '@app/shared';
import { MinioService } from '../minio/minio.service';
import { FileRepository } from './file.repository';
import { type File } from '@app/shared';
import { FileOutboxRepository } from './file-outbox.repository';
import { FileAction } from '@prisma/client';
import { type FileOutboxWithFile } from './utils/file-outbox-with-file-select.util';
import { Transactional } from '@nestjs-cls/transactional';

@Injectable()
export class FileService {
  constructor(
    private readonly minioService: MinioService,
    private readonly fileRepository: FileRepository,
    private readonly fileOutboxRepository: FileOutboxRepository,
  ) {}

  async uploadTmpFile(
    file: Express.Multer.File,
    subdirectory: FileSubdirectory,
  ) {
    const tmpFilePath = await this.minioService.uploadTmpObject(
      file,
      subdirectory,
    );

    const uploadedTmpFile = await this.fileRepository.create({
      url: tmpFilePath,
    });

    await this.fileOutboxRepository.createOne({
      fileId: uploadedTmpFile.id,
      action: FileAction.MOVE_TO_PERMANENT_STORAGE,
      targetPath: tmpFilePath.replace('tmp/', ''),
    });

    return uploadedTmpFile;
  }

  async uploadTmpFiles(
    files: Express.Multer.File[],
    subdirectory: FileSubdirectory,
  ) {
    const tmpFilePaths = await this.minioService.uploadTmpObjects(
      files,
      subdirectory,
    );

    const tmpFileEntities = tmpFilePaths.map((tmpFilePath) => ({
      url: tmpFilePath,
    }));

    const uploadedTmpFiles =
      await this.fileRepository.createMany(tmpFileEntities);

    await this.fileOutboxRepository.createMany(
      uploadedTmpFiles.map((tmpFile) => ({
        fileId: tmpFile.id,
        action: FileAction.MOVE_TO_PERMANENT_STORAGE,
        targetPath: tmpFile.url.replace('tmp/', ''),
      })),
    );

    return uploadedTmpFiles;
  }

  private async deleteFile(file: File) {
    await this.fileRepository.delete(file.id);
    await this.minioService.removeObject(file.url);
  }

  async addFileToDelete(file: File) {
    await this.fileOutboxRepository.createOne({
      fileId: file.id,
      action: FileAction.DELETE_FROM_PERMANENT_STORAGE,
      targetPath: file.url,
    });
  }

  async addFilesToDelete(files: File[]) {
    await this.fileOutboxRepository.createMany(
      files.map((file) => ({
        fileId: file.id,
        action: FileAction.DELETE_FROM_PERMANENT_STORAGE,
        targetPath: file.url,
      })),
    );
  }

  private async moveFileToPermanentStorage(outboxWithFile: FileOutboxWithFile) {
    await this.fileRepository.updateOne(outboxWithFile.file.id, {
      url: outboxWithFile.targetPath,
    });

    await this.fileOutboxRepository.updateOne(outboxWithFile.id, {
      processed: true,
    });

    await this.minioService.moveObjectToPermanentStorage(
      outboxWithFile.targetPath,
      outboxWithFile.file.url,
    );
  }

  @Transactional()
  async processFileOutbox(fileOutboxId: string) {
    const outboxWithFile =
      await this.fileOutboxRepository.findOneWithFile(fileOutboxId);

    if (!outboxWithFile) return;

    switch (outboxWithFile.action) {
      case FileAction.MOVE_TO_PERMANENT_STORAGE:
        await this.moveFileToPermanentStorage(outboxWithFile);
        break;
      case FileAction.DELETE_FROM_PERMANENT_STORAGE:
        await this.deleteFile(outboxWithFile.file);
        break;
      default:
        break;
    }
  }
}
