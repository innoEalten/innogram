import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { MinioModule } from '../minio/minio.module';
import { PrismaModule } from '@app/prisma';
import { FileRepository } from './file.repository';

@Module({
  imports: [MinioModule, PrismaModule],
  providers: [FileService, FileRepository],
  exports: [FileService],
})
export class FileModule {}
