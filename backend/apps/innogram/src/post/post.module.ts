import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '@app/prisma';
import { ImageModule } from '../image/image.module';
import { PostRepository } from './post.repository';
import { JwtModule } from '../jwt/jwt.module';

@Module({
  imports: [AuthModule, PrismaModule, ImageModule, JwtModule],
  controllers: [PostController],
  providers: [PostService, PostRepository],
})
export class PostModule {}
