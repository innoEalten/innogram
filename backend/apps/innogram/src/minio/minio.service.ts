import { Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { InjectMinio } from './minio.decorator';
import { FileSubdirectory } from '@app/shared';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MinioService {
  protected readonly _bucketName: string;

  constructor(
    @InjectMinio() private readonly minioClient: Client,
    private readonly configService: ConfigService,
  ) {
    this._bucketName =
      this.configService.getOrThrow<string>('MINIO_BUCKET_NAME');
  }

  async uploadObjects(
    files: Express.Multer.File[],
    subdirectory: FileSubdirectory,
  ) {
    const now = Date.now();

    const filePaths = await Promise.all(
      files.map(async (file, index) => {
        const filename = `${now}-${index}-${file.originalname}`;
        const filePath = `${subdirectory}/${filename}`;

        await this.minioClient.putObject(
          this._bucketName,
          filePath,
          file.buffer,
          file.size,
          {
            'Content-Type': file.mimetype,
          },
        );

        return filePath;
      }),
    );
    return filePaths;
  }

  removeObjects(files: string[]): Promise<void[]> {
    return Promise.all(
      files.map((url) => {
        this.minioClient.removeObject(this._bucketName, url);
      }),
    );
  }
}
