import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { CreatePostWithAuthorDto, UpdatePostDto, UUIDParamDto } from './dto';

@Injectable()
export class PostRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreatePostWithAuthorDto) {
    const prisma = this.prisma.getClient();

    return prisma.post.create({
      data,
    });
  }

  findManyWithTotal(pagination: { skip: number; take: number }) {
    return this.prisma.$transaction([
      this.prisma.post.findMany({
        ...pagination,
        include: {
          images: {
            include: {
              file: true,
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
    const prisma = this.prisma.getClient();

    return prisma.post.findUnique({
      where: { id },
      include: {
        images: {
          include: {
            file: true,
          },
        },
      },
    });
  }

  update(id: UUIDParamDto['id'], data: UpdatePostDto) {
    const prisma = this.prisma.getClient();

    return prisma.post.update({
      where: { id },
      data,
    });
  }

  delete(id: UUIDParamDto['id']) {
    const prisma = this.prisma.getClient();

    return prisma.post.delete({
      where: { id },
    });
  }
}
