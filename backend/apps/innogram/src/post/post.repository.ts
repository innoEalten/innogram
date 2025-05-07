import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { CreatePostWithAuthorDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreatePostWithAuthorDto) {
    return this.prisma.post.create({
      data,
    });
  }

  findAll() {
    return this.prisma.post.findMany();
  }

  findOne(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
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
