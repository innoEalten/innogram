import { File } from '@prisma/client';
import { FileEntity } from '../../domain/entities';

export class PrismaFileMapper {
  static toEntity(file: File): FileEntity {
    return new FileEntity(file.id, file.url);
  }

  static toEntities(files: File[]): FileEntity[] {
    return files.map((file) => this.toEntity(file));
  }

  static toPrisma(fileEntity: FileEntity): File {
    return {
      id: fileEntity.id,
      url: fileEntity.url,
    };
  }
}
