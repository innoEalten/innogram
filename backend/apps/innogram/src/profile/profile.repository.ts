import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    return this.prisma.profile.findUnique({
      where: { user_id: id },
      include: {
        image: {
          include: {
            file: true,
          },
        },
      },
    });
  }

  async create(data: CreateProfileDto) {
    return this.prisma.profile.create({ data });
  }

  async update(id: string, data: UpdateProfileDto) {
    return this.prisma.profile.update({ where: { user_id: id }, data });
  }

  async delete(id: string) {
    return this.prisma.profile.delete({ where: { user_id: id } });
  }
}
