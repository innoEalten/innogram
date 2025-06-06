import { PaginationQueryDto } from './pagination.dto';

export interface PaginationParams {
  skip: number;
  take: number;
}

export interface PaginationRequestMeta extends PaginationQueryDto {
  total: number;
}

export interface PaginationCalculationInput extends PaginationRequestMeta {
  totalPages: number;
}

export interface PaginationMetadata extends PaginationCalculationInput {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
}

export interface PaginationResponse<T> {
  data: T[];
  meta: PaginationMetadata;
}
