import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';
import { CreateImageInput } from './types/create-image-input';

@Injectable()
export class ImageRepository {
  constructor(private readonly prisma: PrismaService) {}

  findOne(id: string) {
    return this.prisma.getClient().image.findUnique({
      where: { id },
      include: { file: true },
    });
  }

  create(data: CreateImageInput) {
    return this.prisma.getClient().image.create({ data });
  }

  createMany(data: CreateImageInput[]) {
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
