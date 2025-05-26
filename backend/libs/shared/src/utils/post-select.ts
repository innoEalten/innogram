import { Prisma } from '@prisma/client';

export const postSelect = {
  id: true,
  title: true,
  body: true,
  createdAt: true,
  author: {
    select: {
      userId: true,
      name: true,
    },
  },
  images: {
    select: {
      id: true,
      file: {
        select: {
          id: true,
          url: true,
        },
      },
    },
  },
} as const;

export type Post = Prisma.PostGetPayload<{ select: typeof postSelect }>;
