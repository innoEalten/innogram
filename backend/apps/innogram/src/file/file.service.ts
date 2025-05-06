import { Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { InjectMinio } from '../minio/minio.decorator';
import { PrismaService } from '@app/prisma';
import { File } from '@prisma/client';

@Injectable()
export class FileService {
  // TODO: get from env
  protected _bucketName = 'innogram';

  constructor(
    @InjectMinio() private readonly minioService: Client,
    private readonly prisma: PrismaService,
  ) {}

  async bucketsList() {
    return await this.minioService.listBuckets();
  }

  async uploadFile(file: Express.Multer.File, filename: string) {
    await this.minioService.putObject(this._bucketName, filename, file.buffer);

    console.log(filename);

    return this.prisma.file.create({
      data: {
        url: `/${this._bucketName}/${filename}`,
      },
    });
  }
}
