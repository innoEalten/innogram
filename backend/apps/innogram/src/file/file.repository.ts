import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileRepository {
  constructor(private readonly prisma: PrismaService) {}

  createMany(data: { url: string }[]) {
    const prisma = this.prisma.getClient();

    return prisma.file.createManyAndReturn({ data });
  }

  deleteMany(ids: string[]) {
    const prisma = this.prisma.getClient();

    return prisma.file.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
