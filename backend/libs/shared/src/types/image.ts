import { Prisma } from '@prisma/client';

export type Image = Prisma.ImageGetPayload<{
  include: {
    file: true;
  };
}>;
