import { FileAction } from '@prisma/client';

export class FileOutboxEntity {
  constructor(
    public readonly id: string,
    public readonly fileId: string,
    public readonly createdAt: Date,
    public readonly processed: boolean,
    public readonly action: FileAction,
    public readonly targetPath: string,
  ) {}
}
