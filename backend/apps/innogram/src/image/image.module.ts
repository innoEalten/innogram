import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { FileModule } from '../file/file.module';
import { PrismaModule } from '@app/prisma/prisma.module';
@Module({
  imports: [FileModule, PrismaModule],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
