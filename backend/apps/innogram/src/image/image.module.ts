import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { FileModule } from '../file';
import { ImageRepository } from './image.repository';

@Module({
  imports: [FileModule],
  providers: [ImageService, ImageRepository],
  exports: [ImageService],
})
export class ImageModule {}
