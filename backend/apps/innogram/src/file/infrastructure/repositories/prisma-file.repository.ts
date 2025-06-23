import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { type FileRepositoryInterface } from '../../domain/repositories';
import { PrismaFileMapper } from '../mappers';
import { FileEntity } from '../../domain/entities';
import { CreateFileDto, UpdateFileDto } from '../../application/dto';

@Injectable()
export class PrismaFileRepository implements FileRepositoryInterface {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  async updateOne(id: string, data: UpdateFileDto) {
    await this.txHost.tx.file.update({
      where: { id },
      data,
    });
  }

  async create(data: CreateFileDto): Promise<FileEntity> {
    const result = await this.txHost.tx.file.create({ data });
    return PrismaFileMapper.toEntity(result);
  }

  async createMany(data: CreateFileDto[]): Promise<FileEntity[]> {
    const results = await this.txHost.tx.file.createManyAndReturn({ data });
    return PrismaFileMapper.toEntities(results);
  }

  async delete(id: string): Promise<void> {
    await this.txHost.tx.file.delete({
      where: { id },
    });
  }
}
