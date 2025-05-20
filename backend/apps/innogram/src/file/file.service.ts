import { Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { InjectMinio } from '../minio/minio.decorator';
import { FileSubdirectory } from './enum/file.enum';
import { ConfigService } from '@nestjs/config';
import { FileRepository } from './file.repository';

@Injectable()
export class FileService {
  protected readonly _bucketName: string;
  protected readonly _publicUrl: string;

  constructor(
    @InjectMinio() private readonly minioService: Client,
    private readonly configService: ConfigService,
    private readonly fileRepository: FileRepository,
  ) {
    this._bucketName =
      this.configService.getOrThrow<string>('MINIO_BUCKET_NAME');
    this._publicUrl = this.configService.getOrThrow<string>('MINIO_PUBLIC_URL');
  }

  private getObjectPath(path: string): string {
    const parts = path.split('/');
    const relevantParts = parts.filter(Boolean).slice(3);

    return relevantParts.join('/');
  }

  async uploadFiles(
    files: Express.Multer.File[],
    subdirectory: FileSubdirectory,
  ) {
    const now = Date.now();

    const urls = await Promise.all(
      files.map(async (file, index) => {
        const filename = `${now}-${index}-${file.originalname}`;
        const filePath = `${subdirectory}/${filename}`;

        await this.minioService.putObject(
          this._bucketName,
          filePath,
          file.buffer,
          file.size,
          {
            'Content-Type': file.mimetype,
          },
        );

        return `${this._publicUrl}/${this._bucketName}/${filePath}`;
      }),
    );

    const fileEntities = urls.map((url) => ({ url }));
    return this.fileRepository.createMany(fileEntities);
  }

  async deleteFiles(files: { id: string; url: string }[]) {
    await Promise.all(
      files.map(({ url }) => {
        this.minioService.removeObject(
          this._bucketName,
          this.getObjectPath(url),
        );
      }),
    );

    return this.fileRepository.deleteMany(files.map((file) => file.id));
  }
}
