import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaModule } from '@app/prisma';
import { ImageModule } from '../image/image.module';
import { PostRepository } from './post.repository';
import { JwtModule } from '../jwt/jwt.module';
import { CompensationModule } from '../compensation';

@Module({
  imports: [PrismaModule, ImageModule, JwtModule, CompensationModule],
  controllers: [PostController],
  providers: [PostService, PostRepository],
})
export class PostModule {}
