import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    return this.prisma.file.findUnique({
      where: { id },
    });
  }

  async create(bucketName: string, filePath: string) {
    return this.prisma.file.create({
      data: {
        url: `/${bucketName}/${filePath}`,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.file.delete({
      where: { id },
    });
  }
}
