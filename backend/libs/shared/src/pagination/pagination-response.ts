import {
  PaginationCalculationInput,
  PaginationMetadata,
  PaginationRequestMeta,
  PaginationResponse,
} from './pagination.interface';
import { PaginationException } from './pagination.exception';

function getMetaResponse({
  page,
  limit,
  total,
  totalPages,
}: PaginationCalculationInput): PaginationMetadata {
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    previousPage: page > 1 ? page - 1 : null,
  };
}

export function buildPaginationResponse<T>(
  data: T[],
  meta: PaginationRequestMeta,
): PaginationResponse<T> {
  const { page, limit, total } = meta;
  const totalPages = Math.ceil(total / limit);
  const isValidPage = page === 1 || (page <= totalPages && totalPages > 0);

  if (!isValidPage) {
    throw new PaginationException(page, totalPages);
  }

  const metaResponse = getMetaResponse({ ...meta, totalPages });

  return {
    data,
    meta: metaResponse,
  };
}
