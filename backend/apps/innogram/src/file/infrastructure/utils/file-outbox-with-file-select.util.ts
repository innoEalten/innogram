import { Prisma } from '@prisma/client';

export const selectFileOutboxWithFile = {
  id: true,
  action: true,
  targetPath: true,
  file: {
    select: {
      id: true,
      url: true,
    },
  },
} satisfies Prisma.FileOutboxSelect;

export type FileOutboxWithFile = Prisma.FileOutboxGetPayload<{
  select: typeof selectFileOutboxWithFile;
}>;
