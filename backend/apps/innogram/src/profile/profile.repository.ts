import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { type UpdateProfileData } from './types';

@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  findOne(id: string) {
    return this.prisma.profile.findUnique({
      where: { userId: id },
      include: {
        image: {
          include: {
            file: true,
          },
        },
      },
    });
  }

  create(data: CreateProfileDto) {
    return this.prisma.profile.create({ data });
  }

  update(id: string, data: UpdateProfileData) {
    return this.prisma.profile.update({ where: { userId: id }, data });
  }

  delete(id: string) {
    return this.prisma.profile.delete({ where: { userId: id } });
  }
}
