import { Module } from '@nestjs/common';
import { FileService } from './domain/services/file.service';
import { MinioModule } from '../minio';
import { PrismaFileRepository } from './infrastructure/repositories/prisma-file.repository';
import { FileOutboxRepository } from './file-outbox.repository';
import { FileRepositoryToken } from './domain/repositories';

@Module({
  imports: [MinioModule],
  providers: [
    FileService,
    FileOutboxRepository,
    { provide: FileRepositoryToken, useClass: PrismaFileRepository },
  ],
  exports: [FileService],
})
export class FileModule {}
