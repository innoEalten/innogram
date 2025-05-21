import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageRepository {
  constructor(private readonly prisma: PrismaService) {}

  createMany(data: { fileId: string; postId?: string }[]) {
    return this.prisma.getClient().image.createManyAndReturn({ data });
  }

  deleteMany(ids: string[]) {
    return this.prisma.getClient().image.deleteMany({
      where: { id: { in: ids } },
    });
  }
}
