import { CreateFileDto } from '../../application/dto/create-file.dto';
import { UpdateFileDto } from '../../application/dto/update-file.dto';

export const FileRepositoryToken = Symbol('FileRepositoryInterface');
export interface FileRepositoryInterface {
  updateOne(id: string, data: UpdateFileDto): any;
  create(data: CreateFileDto): any;
  createMany(data: CreateFileDto[]): any;
  delete(id: string): any;
  deleteMany(ids: string[]): any;
}
