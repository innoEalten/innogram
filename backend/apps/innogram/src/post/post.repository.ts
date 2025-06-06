import { Injectable } from '@nestjs/common';
import { type PostWithAuthor, UpdatePostDto } from './dto';
import { postSelect, PaginationParams } from '@app/shared';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

@Injectable()
export class PostRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  create(data: PostWithAuthor) {
    return this.txHost.tx.post.create({
      data,
    });
  }

  findManyWithTotal(pagination: PaginationParams) {
    return Promise.all([
      this.txHost.tx.post.findMany({
        ...pagination,
        select: postSelect,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.txHost.tx.post.count(),
    ]);
  }

  findOne(postId: string) {
    return this.txHost.tx.post.findUnique({
      where: { id: postId },
      select: postSelect,
    });
  }

  update(postId: string, data: Pick<UpdatePostDto, 'body' | 'title'>) {
    return this.txHost.tx.post.update({
      where: { id: postId },
      data,
    });
  }

  delete(postId: string) {
    return this.txHost.tx.post.delete({
      where: { id: postId },
    });
  }
}
