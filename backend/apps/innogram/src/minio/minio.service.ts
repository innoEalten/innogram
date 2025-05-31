import { Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { InjectMinio } from './minio.decorator';
import { FileSubdirectory } from '@app/shared';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { extname } from 'path';
import { MinioCompensationService } from './compensation';

@Injectable()
export class MinioService {
  protected readonly _bucketName: string;

  constructor(
    @InjectMinio() private readonly minioClient: Client,
    private readonly configService: ConfigService,
    private readonly compensationService: MinioCompensationService,
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

  private async uploadSingleFile(
    file: Express.Multer.File,
    subdirectory: FileSubdirectory,
    index: number = 0,
  ): Promise<string> {
    const filename = this.generateFileName(file.originalname, index);
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

    this.compensationService.register(async () => {
      await this.minioClient.removeObject(this._bucketName, filePath);
    });

    return filePath;
  }

  private async removeSingleFile(filePath: string): Promise<void> {
    const trashPath = `trash/${filePath}`;

    await this.minioClient.copyObject(
      this._bucketName,
      trashPath,
      `/${this._bucketName}/${filePath}`,
    );

    this.compensationService.register(async () => {
      await this.minioClient.copyObject(
        this._bucketName,
        filePath,
        `/${this._bucketName}/${trashPath}`,
      );
      await this.minioClient.removeObject(this._bucketName, trashPath);
    });

    await this.minioClient.removeObject(this._bucketName, filePath);
  }

  async uploadObject(
    file: Express.Multer.File,
    subdirectory: FileSubdirectory,
  ): Promise<string> {
    return this.uploadSingleFile(file, subdirectory);
  }

  async uploadObjects(
    files: Express.Multer.File[],
    subdirectory: FileSubdirectory,
  ): Promise<string[]> {
    return Promise.all(
      files.map((file, index) =>
        this.uploadSingleFile(file, subdirectory, index),
      ),
    );
  }

  async removeObject(filePath: string): Promise<void> {
    return this.removeSingleFile(filePath);
  }

  async removeObjects(files: string[]): Promise<void[]> {
    return Promise.all(
      files.map(async (filePath) => {
        await this.removeSingleFile(filePath);
      }),
    );
  }
}
