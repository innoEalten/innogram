export interface PaginationRequestMeta {
  page: number;
  limit: number;
  total: number;
}

export interface PaginationCalculationInput extends PaginationRequestMeta {
  totalPages: number;
}

export interface PaginationMetadata extends PaginationRequestMeta {
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
}

export interface PaginationResponse<T> {
  data: T[];
  meta: PaginationMetadata;
}
