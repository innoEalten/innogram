import { PostsNotFoundException } from '../exeptions';
import { PaginationResponse } from '@app/shared';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export function buildPaginationResponse<T>(
  data: T[],
  meta: PaginationMeta,
): PaginationResponse<T> {
  const { page, limit, total } = meta;
  const totalPages = Math.ceil(total / limit);
  const isValidPage = page === 1 || (page <= totalPages && totalPages > 0);

  if (!isValidPage) {
    throw new PostsNotFoundException();
  }

  return {
    data,
    page,
    limit,
    total,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    previousPage: page > 1 ? page - 1 : null,
  };
}
