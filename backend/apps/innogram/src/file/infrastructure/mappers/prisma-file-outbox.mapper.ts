import { FileOutboxEntity } from '../../domain/entities';

export class PrismaFileOutboxMapper {
  static toPrismaEntity(fileOutboxEntity: FileOutboxEntity) {
    return {
      id: fileOutboxEntity.id,
      fileId: fileOutboxEntity.fileId,
      action: fileOutboxEntity.action,
      createdAt: fileOutboxEntity.createdAt,
      processed: fileOutboxEntity.processed,
      targetPath: fileOutboxEntity.targetPath,
    };
  }

  static toPrismaEntities(fileOutboxEntities: FileOutboxEntity[]) {
    return fileOutboxEntities.map((fileOutboxEntity) =>
      this.toPrismaEntity(fileOutboxEntity),
    );
  }
}
