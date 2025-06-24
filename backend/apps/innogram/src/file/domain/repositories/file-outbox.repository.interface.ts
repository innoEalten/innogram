import { FileOutboxEntity } from '../entities';

export const FileOutboxRepositoryToken = 'FileOutboxRepositoryToken';

export interface FileOutboxRepository {
  createOne(fileOutboxEntity: FileOutboxEntity): Promise<void>;
  createMany(fileOutboxEntities: FileOutboxEntity[]): Promise<void>;
  updateOne(): Promise<void>;
  findOneWithFile(id: string): Promise<FileOutboxEntity | null>;
}
