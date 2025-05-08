import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { CreatePostWithAuthorDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreatePostWithAuthorDto, images: string[]) {
    return this.prisma.post.create({
      data: {
        ...data,
        images: {
          connect: images.map((id) => ({ id })),
        },
      },
    });
  }

  findAll() {
    return this.prisma.post.findMany();
  }

  findOne(id: string) {
    return this.prisma.post.findUnique({
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

  update(id: string, data: UpdatePostDto) {
    return this.prisma.post.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.post.delete({
      where: { id },
    });
  }
}
