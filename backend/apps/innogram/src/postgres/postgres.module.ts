import { Module } from '@nestjs/common';
import { PostgresWorker } from './postgres.worker';
import { FileModule } from '../file';

@Module({
  imports: [FileModule],
  providers: [PostgresWorker],
  exports: [PostgresWorker],
})
export class PostgresModule {}
