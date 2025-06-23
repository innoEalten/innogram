import { FileOutboxEntity, FileEntity } from '../entities';
import { FileAction } from '@prisma/client';

export const FileOutboxRepositoryToken = 'FileOutboxRepositoryToken';

export interface FileOutboxRepository {
  createOne(fileEntity: FileEntity, fileAction: FileAction): Promise<void>;
  createMany(fileEntities: FileEntity[], fileAction: FileAction): Promise<void>;
  updateOne(): Promise<void>;
  findOneWithFile(id: string): Promise<FileOutboxEntity | null>;
}
