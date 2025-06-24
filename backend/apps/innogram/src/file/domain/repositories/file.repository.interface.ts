import { UpdateFileDto } from '../../application/dto';
import { FileEntity } from '../entities';

export const FileRepositoryToken = 'FileRepositoryToken';

export interface FileRepository {
  updateOne(id: string, data: UpdateFileDto): Promise<void>;
  createOne(fileEntity: FileEntity): Promise<FileEntity>;
  createMany(fileEnities: FileEntity[]): Promise<FileEntity[]>;
  deleteOne(id: string): Promise<void>;
}
