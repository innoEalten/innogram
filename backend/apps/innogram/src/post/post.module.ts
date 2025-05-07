import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '@app/prisma';
import { FileModule } from '../file/file.module';
import { PostRepository } from './post.repository';

@Module({
  imports: [AuthModule, PrismaModule, FileModule],
  controllers: [PostController],
  providers: [PostService, PostRepository],
})
export class PostModule {}
