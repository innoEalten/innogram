import { File } from '@prisma/client';
import { FileEntity } from '../../domain/entities';

export class PrismaFileMapper {
  static toDomainEntity(file: File): FileEntity {
    return FileEntity.create(file);
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

  static toPrismaEntities(fileEntities: FileEntity[]): File[] {
    return fileEntities.map((fileEntity) => this.toPrismaEntity(fileEntity));
  }
}
