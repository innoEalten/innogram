import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { FileModule } from '../file/file.module';

@Module({
  imports: [FileModule],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
