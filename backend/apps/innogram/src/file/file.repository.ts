import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileRepository {
  constructor(private readonly prisma: PrismaService) {}

  createMany(data: { url: string }[]) {
    return this.prisma.getClient().file.createManyAndReturn({ data });
  }

  deleteMany(ids: string[]) {
    return this.prisma.getClient().file.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
