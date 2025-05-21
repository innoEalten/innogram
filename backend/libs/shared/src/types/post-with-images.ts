import { Prisma } from '@prisma/client';

export type PostWithImages = Prisma.PostGetPayload<{
  select: {
    id: true;
    title: true;
    body: true;
    createdAt: true;
    author: {
      select: {
        userId: true;
        name: true;
      };
    };
    images: {
      select: {
        id: true;
        file: {
          select: {
            id: true;
            url: true;
          };
        };
      };
    };
  };
}>;
