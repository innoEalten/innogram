import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { CreatePostWithAuthorDto, UpdatePostDto, UUIDParamDto } from './dto';
import { postSelect } from '@app/shared';

@Injectable()
export class PostRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreatePostWithAuthorDto) {
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

  findOne(id: UUIDParamDto['id']) {
    return this.prisma.getClient().post.findUnique({
      where: { id },
      select: postSelect,
    });
  }

  update(id: UUIDParamDto['id'], data: UpdatePostDto) {
    return this.prisma.getClient().post.update({
      where: { id },
      data,
    });
  }

  delete(id: UUIDParamDto['id']) {
    return this.prisma.getClient().post.delete({
      where: { id },
    });
  }
}
