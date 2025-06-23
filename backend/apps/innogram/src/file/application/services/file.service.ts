import { Injectable, Inject } from '@nestjs/common';
import { FileSubdirectory } from '@app/shared';
import { MinioService } from '../../../minio/minio.service';
import { FileAction, type File } from '@prisma/client';
import { type FileOutboxWithFile } from '../../infrastructure/utils/file-outbox-with-file-select.util';
import { Transactional } from '@nestjs-cls/transactional';
import { FileOutboxNotFoundError } from '../exceptions';
import {
  type FileRepository,
  FileRepositoryToken,
  type FileOutboxRepository,
  FileOutboxRepositoryToken,
} from '../../domain/repositories';
import { FileEntity } from '../../domain/entities';

@Injectable()
export class FileService {
  constructor(
    private readonly minioService: MinioService,
    @Inject(FileRepositoryToken)
    private readonly fileRepository: FileRepository,
    @Inject(FileOutboxRepositoryToken)
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

    const uploadedTmpFile = await this.fileRepository.create(
      new FileEntity(undefined, tmpFilePath),
    );

    await this.fileOutboxRepository.createOne(
      uploadedTmpFile,
      FileAction.MOVE_TO_PERMANENT_STORAGE,
    );

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
      uploadedTmpFiles,
      FileAction.MOVE_TO_PERMANENT_STORAGE,
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

    if (!outboxWithFile) throw new FileOutboxNotFoundError();

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
