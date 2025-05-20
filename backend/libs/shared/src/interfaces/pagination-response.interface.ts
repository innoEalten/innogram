export interface PaginationResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
}
