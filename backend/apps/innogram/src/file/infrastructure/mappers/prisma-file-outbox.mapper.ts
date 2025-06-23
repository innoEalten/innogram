import { FileEntity } from '../../domain/entities';
import { type FileAction } from '@prisma/client';

export class PrismaFileOutboxMapper {
  private static getTargetPath(url: string): string {
    return url.replace('tmp/', '');
  }

  static toCreateOneOrmEntity(fileEntity: FileEntity, fileAction: FileAction) {
    return {
      fileId: fileEntity.id,
      action: fileAction,
      targetPath: this.getTargetPath(fileEntity.url),
    };
  }
}
