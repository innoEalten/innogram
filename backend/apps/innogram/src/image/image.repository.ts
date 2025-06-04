import { Injectable } from '@nestjs/common';
import { CreateImageData } from './types';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

@Injectable()
export class ImageRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  findOne(id: string) {
    return this.txHost.tx.image.findUnique({
      where: { id },
      include: { file: true },
    });
  }

  create(data: CreateImageData) {
    return this.txHost.tx.image.create({ data });
  }

  createMany(data: CreateImageData[]) {
    return this.txHost.tx.image.createManyAndReturn({ data });
  }

  delete(id: string) {
    return this.txHost.tx.image.delete({
      where: { id },
    });
  }

  deleteMany(ids: string[]) {
    return this.txHost.tx.image.deleteMany({
      where: { id: { in: ids } },
    });
  }
}
