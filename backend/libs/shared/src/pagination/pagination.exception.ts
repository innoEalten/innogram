import { NotFoundException } from '@nestjs/common';

export class PaginationException extends NotFoundException {
  constructor(page: number, totalPages: number) {
    super(`Page ${page} does not exist. Total pages: ${totalPages}`);
  }
}
