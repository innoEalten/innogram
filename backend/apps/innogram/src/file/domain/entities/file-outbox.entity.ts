import { FileAction } from '@prisma/client';
import { randomUUID } from 'crypto';

type FileOutboxData = {
  id?: string;
  fileId: string;
  createdAt?: Date;
  processed?: boolean;
  action: FileAction;
  targetPath: string;
};

export class FileOutboxEntity {
  constructor(
    public readonly id: string,
    public readonly fileId: string,
    public readonly createdAt: Date,
    public readonly processed: boolean,
    public readonly action: FileAction,
    public readonly targetPath: string,
  ) {}

  static create({
    id = randomUUID(),
    fileId,
    createdAt = new Date(),
    processed = false,
    action,
    targetPath,
  }: FileOutboxData): FileOutboxEntity {
    return new FileOutboxEntity(
      id,
      fileId,
      createdAt,
      processed,
      action,
      targetPath,
    );
  }
}
