import { Module } from '@nestjs/common';
import { CompensationService } from './compensation.service';

@Module({
  providers: [CompensationService],
  exports: [CompensationService],
})
export class CompensationModule {}
