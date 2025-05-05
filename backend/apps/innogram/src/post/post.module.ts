import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '@app/prisma';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
