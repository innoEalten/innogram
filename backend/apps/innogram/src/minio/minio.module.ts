import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MINIO_TOKEN } from './minio.decorator';
import { minioConfig } from './config/minio.config';
import { MinioService } from './minio.service';
import { CompensationModule } from '../compensation';

@Global()
@Module({
  imports: [CompensationModule],
  exports: [MINIO_TOKEN, MinioService],
  providers: [
    MinioService,
    {
      inject: [ConfigService],
      provide: 'MINIO_CLIENT',
      useFactory: minioConfig,
    },
    {
      inject: [ConfigService],
      provide: MINIO_TOKEN,
      useFactory: minioConfig,
    },
  ],
})
export class MinioModule {}
