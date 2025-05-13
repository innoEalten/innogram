import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/env-validation.config';
import { PostModule } from './post/post.module';
import { FileModule } from './file/file.module';
import { MinioModule } from './minio/minio.module';
import { ImageModule } from './image/image.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ChatModule } from './chat/chat.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema,
    }),
    EventEmitterModule.forRoot({
      global: true,
    }),
    AuthModule,
    ProfileModule,
    PostModule,
    MinioModule,
    FileModule,
    ImageModule,
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
