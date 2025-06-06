import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { MinioModule } from '../minio';
import { FileRepository } from './file.repository';
import { FileOutboxRepository } from './file-outbox.repository';

@Module({
  imports: [MinioModule],
  providers: [FileService, FileRepository, FileOutboxRepository],
  exports: [FileService, FileRepository],
})
export class FileModule {}
