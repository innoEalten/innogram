import { CreateFileDto, UpdateFileDto } from '../../application/dto';
import { FileEntity } from '../entities';

export const FileRepositoryToken = Symbol('FileRepositoryToken');

export interface FileRepositoryInterface {
  updateOne(id: string, data: UpdateFileDto): Promise<void>;
  create(data: CreateFileDto): Promise<FileEntity>;
  createMany(data: CreateFileDto[]): Promise<FileEntity[]>;
  delete(id: string): Promise<void>;
}
