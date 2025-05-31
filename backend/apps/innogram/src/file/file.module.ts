import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { MinioModule } from '../minio';
import { PrismaModule } from '@app/prisma';
import { FileRepository } from './file.repository';

@Module({
  imports: [MinioModule, PrismaModule],
  providers: [FileService, FileRepository],
  exports: [FileService],
})
export class FileModule {}
