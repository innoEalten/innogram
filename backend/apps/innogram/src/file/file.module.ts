import { Module } from '@nestjs/common';
import { FileService } from './application/services';
import { MinioModule } from '../minio';
import {
  PrismaFileRepository,
  PrismaFileOutboxRepository,
} from './infrastructure/repositories';
import {
  FileRepositoryToken,
  FileOutboxRepositoryToken,
} from './domain/repositories';

@Module({
  imports: [MinioModule],
  providers: [
    FileService,
    { provide: FileRepositoryToken, useClass: PrismaFileRepository },
    {
      provide: FileOutboxRepositoryToken,
      useClass: PrismaFileOutboxRepository,
    },
  ],
  exports: [FileService],
})
export class FileModule {}
