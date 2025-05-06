import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { MinioModule } from '../minio/minio.module';
import { PrismaModule } from '@app/prisma';

@Module({
  imports: [MinioModule, PrismaModule],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
