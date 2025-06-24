import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { type FileRepository } from '../../domain/repositories';
import { PrismaFileMapper } from '../mappers';
import { FileEntity } from '../../domain/entities';
import { UpdateFileDto } from '../../application/dto';

@Injectable()
export class PrismaFileRepository implements FileRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  async updateOne(id: string, data: UpdateFileDto) {
    await this.txHost.tx.file.update({
      where: { id },
      data,
    });
  }

  async createOne(fileEntity: FileEntity): Promise<FileEntity> {
    const data = PrismaFileMapper.toPrismaEntity(fileEntity);

    const result = await this.txHost.tx.file.create({ data });

    return PrismaFileMapper.toDomainEntity(result);
  }

  async createMany(fileEntities: FileEntity[]): Promise<FileEntity[]> {
    const data = PrismaFileMapper.toPrismaEntities(fileEntities);

    const results = await this.txHost.tx.file.createManyAndReturn({ data });

    return PrismaFileMapper.toDomainEntities(results);
  }

  async deleteOne(id: string): Promise<void> {
    await this.txHost.tx.file.delete({
      where: { id },
    });
  }
}
