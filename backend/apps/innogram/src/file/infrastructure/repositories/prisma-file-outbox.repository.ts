import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { FileOutbox } from '@prisma/client';
import { selectFileOutboxWithFile } from '../utils/file-outbox-with-file-select.util';
import { FileOutboxRepository } from '../../domain/repositories';
import { FileEntity } from '../../domain/entities';
import { FileAction } from '@prisma/client';
import { PrismaFileOutboxMapper } from '../mappers';

type CreateFileOutboxData = Pick<
  FileOutbox,
  'fileId' | 'action' | 'targetPath'
>;

@Injectable()
export class PrismaFileOutboxRepository implements FileOutboxRepository {
  constructor(
    private readonly transactionHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  async createOne(
    fileEntity: FileEntity,
    fileAction: FileAction,
  ): Promise<void> {
    const data = PrismaFileOutboxMapper.toCreateOneOrmEntity(
      fileEntity,
      fileAction,
    );

    await this.transactionHost.tx.fileOutbox.create({
      data,
    });
  }

  createMany(data: CreateFileOutboxData[]) {
    return this.transactionHost.tx.fileOutbox.createMany({ data });
  }

  updateOne(id: string, data: Pick<FileOutbox, 'processed'>) {
    return this.transactionHost.tx.fileOutbox.update({
      where: { id },
      data,
    });
  }

  findOneWithFile(id: string) {
    return this.transactionHost.tx.fileOutbox.findUnique({
      where: { id },
      select: selectFileOutboxWithFile,
    });
  }
}
