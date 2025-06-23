import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { type FileRepositoryInterface } from '../../domain/repositories';

@Injectable()
export class PrismaFileRepository implements FileRepositoryInterface {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  updateOne(id: string, data: { url: string }) {
    return this.txHost.tx.file.update({
      where: { id },
      data,
    });
  }

  create(data: { url: string }) {
    return this.txHost.tx.file.create({ data });
  }

  createMany(data: { url: string }[]) {
    return this.txHost.tx.file.createManyAndReturn({ data });
  }

  delete(id: string) {
    return this.txHost.tx.file.delete({
      where: { id },
    });
  }

  deleteMany(ids: string[]) {
    return this.txHost.tx.file.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
