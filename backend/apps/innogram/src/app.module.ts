import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/env-validation.config';
import { PostModule } from './post/post.module';
import { FileModule } from './file/file.module';
import { MinioModule } from './minio/minio.module';
import { ImageModule } from './image/image.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema,
    }),
    AuthModule,
    ProfileModule,
    PostModule,
    MinioModule,
    FileModule,
    ImageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
