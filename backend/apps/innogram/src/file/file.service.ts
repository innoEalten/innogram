import { Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { InjectMinio } from '../minio/minio.decorator';
import { PrismaService } from '@app/prisma';
import { File } from '@prisma/client';
import { FileSubdirectory } from './enum/file.enum';
import { ConfigService } from '@nestjs/config';
import { FileNotFoundException } from './exeptions/fileNotFound.exeption';

@Injectable()
export class FileService {
  protected readonly _bucketName: string;

  constructor(
    @InjectMinio() private readonly minioService: Client,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this._bucketName =
      this.configService.getOrThrow<string>('MINIO_BUCKET_NAME');
  }

  async bucketsList() {
    return await this.minioService.listBuckets();
  }

  async uploadFile(
    file: Express.Multer.File,
    filename: string,
    subdirectory?: FileSubdirectory,
  ) {
    const filePath = subdirectory ? `${subdirectory}/${filename}` : filename;

    await this.minioService.putObject(this._bucketName, filePath, file.buffer);

    return this.prisma.file.create({
      data: {
        url: `/${this._bucketName}/${filePath}`,
      },
    });
  }

  async deleteFile(file_id: string) {
    const file = await this.prisma.file.findUnique({
      where: { id: file_id },
    });

    if (!file) {
      throw new FileNotFoundException();
    }

    await this.minioService.removeObject(this._bucketName, file.url);
    await this.prisma.file.delete({ where: { id: file_id } });
  }
}
