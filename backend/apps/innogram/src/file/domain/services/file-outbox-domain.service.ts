import { FileEntity, FileOutboxEntity } from '../entities';
import { FileAction } from '@prisma/client';

export class FileOutboxDomainService {
  static createFromFileEntity(
    file: FileEntity,
    action: FileAction,
  ): FileOutboxEntity {
    let targetPath = file.url;

    if (
      action === FileAction.MOVE_TO_PERMANENT_STORAGE &&
      file.url.startsWith('tmp/')
    ) {
      targetPath = file.url.replace('tmp/', '');
    }

    return FileOutboxEntity.create({
      fileId: file.id,
      action,
      targetPath,
    });
  }
}
