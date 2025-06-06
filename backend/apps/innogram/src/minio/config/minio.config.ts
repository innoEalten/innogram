import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';

export const minioConfig = (configService: ConfigService): Client => {
  const client = new Client({
    endPoint: configService.getOrThrow('MINIO_ENDPOINT'),
    port: +configService.getOrThrow('MINIO_PORT'),
    accessKey: configService.getOrThrow('MINIO_ACCESS_KEY'),
    secretKey: configService.getOrThrow('MINIO_SECRET_KEY'),
    useSSL: false,
  });

  return client;
};
