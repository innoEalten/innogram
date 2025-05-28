import { IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  limit: number = 10;
}
