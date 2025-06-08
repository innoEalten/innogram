import { PostgresWorkerConstants } from '@app/shared/constants';

export class FileOutboxNotFoundError extends Error {
  constructor() {
    super(PostgresWorkerConstants.FILE_OUTBOX_NOT_FOUND);
    this.name = 'FileOutboxNotFoundError';
  }
}
