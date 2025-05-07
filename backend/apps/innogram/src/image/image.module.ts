import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { FileModule } from '../file/file.module';
import { PrismaModule } from '@app/prisma/prisma.module';
import { ImageRepository } from './image.repository';

@Module({
  imports: [FileModule, PrismaModule],
  providers: [ImageService, ImageRepository],
  exports: [ImageService],
})
export class ImageModule {}
