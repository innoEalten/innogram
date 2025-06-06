import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { FileOutbox } from '@prisma/client';
import { selectFileOutboxWithFile } from './utils/file-outbox-with-file-select.util';

type CreateFileOutboxData = Pick<
  FileOutbox,
  'fileId' | 'action' | 'targetPath'
>;

@Injectable()
export class FileOutboxRepository {
  constructor(
    private readonly transactionHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  createOne(data: CreateFileOutboxData) {
    return this.transactionHost.tx.fileOutbox.create({ data });
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
