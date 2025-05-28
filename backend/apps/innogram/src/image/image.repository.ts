import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';

type ImageData = {
  fileId: string;
  postId?: string;
};

@Injectable()
export class ImageRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: ImageData) {
    return this.prisma.getClient().image.create({ data });
  }

  createMany(data: ImageData[]) {
    return this.prisma.getClient().image.createManyAndReturn({ data });
  }

  delete(id: string) {
    return this.prisma.getClient().image.delete({
      where: { id },
    });
  }

  deleteMany(ids: string[]) {
    return this.prisma.getClient().image.deleteMany({
      where: { id: { in: ids } },
    });
  }
}
