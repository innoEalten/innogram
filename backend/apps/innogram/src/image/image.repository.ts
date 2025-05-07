import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    return this.prisma.image.findUnique({
      where: { id },
      include: {
        file: true,
      },
    });
  }

  async create(fileId: string, postId?: string) {
    return this.prisma.image.create({
      data: { file_id: fileId, post_id: postId },
    });
  }

  async delete(id: string) {
    return this.prisma.image.delete({
      where: { id },
    });
  }
}
