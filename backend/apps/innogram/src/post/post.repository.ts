import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { type PostWithAuthor, UpdatePostDto } from './dto';
import { postSelect } from '@app/shared';

@Injectable()
export class PostRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: PostWithAuthor) {
    return this.prisma.getClient().post.create({
      data,
    });
  }

  findManyWithTotal(pagination: { skip: number; take: number }) {
    return this.prisma.$transaction([
      this.prisma.post.findMany({
        ...pagination,
        select: postSelect,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.post.count(),
    ]);
  }

  findOne(postId: string) {
    return this.prisma.getClient().post.findUnique({
      where: { id: postId },
      select: postSelect,
    });
  }

  update(postId: string, data: UpdatePostDto) {
    return this.prisma.getClient().post.update({
      where: { id: postId },
      data,
    });
  }

  delete(postId: string) {
    return this.prisma.getClient().post.delete({
      where: { id: postId },
    });
  }
}
