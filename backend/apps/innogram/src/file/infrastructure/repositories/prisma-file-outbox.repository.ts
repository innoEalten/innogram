import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { FileOutbox } from '@prisma/client';
import { selectFileOutboxWithFile } from '../utils/file-outbox-with-file-select.util';
import { FileOutboxRepository } from '../../domain/repositories';
import { FileOutboxEntity } from '../../domain/entities';

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

  async createOne(fileOutboxEntity: FileOutboxEntity): Promise<void> {
    const data = PrismaFileOutboxMapper.toPrismaEntity(fileOutboxEntity);

    await this.transactionHost.tx.fileOutbox.create({
      data,
    });
  }

  async createMany(fileOutboxEntities: FileOutboxEntity[]): Promise<void> {
    const data = PrismaFileOutboxMapper.toPrismaEntities(fileOutboxEntities);

    await this.transactionHost.tx.fileOutbox.createMany({
      data,
    });
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
