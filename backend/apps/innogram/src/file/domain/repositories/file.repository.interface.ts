import { CreateFileDto, UpdateFileDto } from '../../application/dto';
import { FileEntity } from '../entities';

export const FileRepositoryToken = Symbol('FileRepositoryToken');

export interface FileRepository {
  updateOne(id: string, data: UpdateFileDto): Promise<void>;
  create(fileEntity: FileEntity): Promise<FileEntity>;
  createMany(data: CreateFileDto[]): Promise<FileEntity[]>;
  delete(id: string): Promise<void>;
}
