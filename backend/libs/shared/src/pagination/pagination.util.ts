import { PaginationQueryDto } from './pagination.dto';
import { PaginationParams } from './pagination.interface';

export function getPaginationParams({
  page,
  limit,
}: PaginationQueryDto): PaginationParams {
  const skip = (page - 1) * limit;
  const take = limit;
  return { skip, take };
}
