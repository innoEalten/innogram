import { Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { InjectMinio } from './minio.decorator';
import { FileSubdirectory } from '@app/shared';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { extname } from 'path';

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

  private generateFileName(originalName: string, index: number): string {
    const ext = extname(originalName);
    const hash = createHash('sha256')
      .update(`${Date.now()}-${originalName}-${index}`)
      .digest('hex');
    return `${hash}${ext}`;
  }

  private async uploadTmpSingleFile(
    file: Express.Multer.File,
    subdirectory: FileSubdirectory,
    index: number = 0,
  ): Promise<string> {
    const filename = this.generateFileName(file.originalname, index);
    const filePath = `${subdirectory}/${filename}`;
    const tmpFilePath = `tmp/${filePath}`;

    await this.minioClient.putObject(
      this._bucketName,
      tmpFilePath,
      file.buffer,
      file.size,
      {
        'Content-Type': file.mimetype,
      },
    );

    return tmpFilePath;
  }

  private async removeSingleFile(filePath: string): Promise<void> {
    await this.minioClient.removeObject(this._bucketName, filePath);
  }

  async moveObjectToPermanentStorage(
    targetPath: string,
    tmpFilePath: string,
  ): Promise<void> {
    await this.minioClient.copyObject(
      this._bucketName,
      targetPath,
      `/${this._bucketName}/${tmpFilePath}`,
    );

    await this.minioClient.removeObject(this._bucketName, tmpFilePath);
  }

  uploadTmpObject(
    file: Express.Multer.File,
    subdirectory: FileSubdirectory,
  ): Promise<string> {
    return this.uploadTmpSingleFile(file, subdirectory);
  }

  uploadTmpObjects(
    files: Express.Multer.File[],
    subdirectory: FileSubdirectory,
  ): Promise<string[]> {
    return Promise.all(
      files.map((file, index) =>
        this.uploadTmpSingleFile(file, subdirectory, index),
      ),
    );
  }

  removeObject(filePath: string): Promise<void> {
    return this.removeSingleFile(filePath);
  }

  removeObjects(files: string[]): Promise<void[]> {
    return Promise.all(
      files.map(async (filePath) => {
        await this.removeSingleFile(filePath);
      }),
    );
  }
}
