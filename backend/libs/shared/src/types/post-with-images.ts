import { Prisma } from '@prisma/client';

export type PostWithImages = Prisma.PostGetPayload<{
  include: {
    images: {
      include: {
        file: true;
      };
    };
  };
}>;
