import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MINIO_TOKEN } from './minio.decorator';
import { minioConfig } from './config/minio.config';
import { MinioService } from './minio.service';
import { MinioCompensationService } from './compensation/minio-compensation.service';
import { APP_FILTER } from '@nestjs/core';
import { MinioExceptionFilter } from './filters/minio-exception.filter';

@Global()
@Module({
  providers: [
    MinioService,
    MinioCompensationService,
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
    {
      provide: APP_FILTER,
      useClass: MinioExceptionFilter,
    },
  ],
  exports: [MINIO_TOKEN, MinioService, MinioCompensationService],
})
export class MinioModule {}
