import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageRepository {
  constructor(private readonly prisma: PrismaService) {}

  createMany(data: { fileId: string; postId?: string }[]) {
    const prisma = this.prisma.getClient();

    return prisma.image.createManyAndReturn({ data });
  }

  deleteMany(ids: string[]) {
    const prisma = this.prisma.getClient();

    return prisma.image.deleteMany({
      where: { id: { in: ids } },
    });
  }
}
