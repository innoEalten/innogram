import { Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { InjectMinio } from '../minio/minio.decorator';
import { PrismaService } from '@app/prisma';
import { FileSubdirectory } from './enum/file.enum';
import { ConfigService } from '@nestjs/config';
import { FileNotFoundException } from './exeptions/fileNotFound.exeption';
import { FileRepository } from './file.repository';

@Injectable()
export class FileService {
  protected readonly _bucketName: string;

  constructor(
    @InjectMinio() private readonly minioService: Client,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly fileRepository: FileRepository,
  ) {
    this._bucketName =
      this.configService.getOrThrow<string>('MINIO_BUCKET_NAME');
  }

  private getObjectPath(path: string): string {
    const parts = path.split('/');
    const relevantParts = parts.filter(Boolean).slice(1);

    return relevantParts.join('/');
  }

  async uploadFile(
    file: Express.Multer.File,
    filename: string,
    subdirectory?: FileSubdirectory,
  ) {
    const filePath = subdirectory ? `${subdirectory}/${filename}` : filename;

    await this.minioService.putObject(this._bucketName, filePath, file.buffer);

    return this.fileRepository.create(this._bucketName, filePath);
  }

  async deleteFile(file_id: string) {
    const file = await this.fileRepository.findOne(file_id);

    if (!file) {
      throw new FileNotFoundException();
    }

    await this.minioService.removeObject(
      this._bucketName,
      this.getObjectPath(file.url),
    );
    await this.fileRepository.delete(file_id);
  }
}
