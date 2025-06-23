import { File } from '@prisma/client';
import { FileEntity } from '../../domain/entities';

export class PrismaFileMapper {
  static toDomainEntity(file: File): FileEntity {
    return new FileEntity(file.id, file.url);
  }

  static toDomainEntities(files: File[]): FileEntity[] {
    return files.map((file) => this.toDomainEntity(file));
  }

  static toPrismaEntity(fileEntity: FileEntity): File {
    return {
      id: fileEntity.id,
      url: fileEntity.url,
    };
  }
}
