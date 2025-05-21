import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { CreatePostWithAuthorDto, UpdatePostDto, UUIDParamDto } from './dto';

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
        select: {
          id: true,
          title: true,
          body: true,
          createdAt: true,
          author: {
            select: {
              userId: true,
              name: true,
            },
          },
          images: {
            select: {
              id: true,
              file: {
                select: {
                  id: true,
                  url: true,
                },
              },
            },
          },
        },
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
      select: {
        id: true,
        title: true,
        body: true,
        createdAt: true,
        author: {
          select: {
            userId: true,
            name: true,
          },
        },
        images: {
          select: {
            id: true,
            file: {
              select: {
                id: true,
                url: true,
              },
            },
          },
        },
      },
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
