import { FileOutboxErrorMessages } from '@app/shared';

export class FileOutboxNotFoundError extends Error {
  constructor() {
    super(FileOutboxErrorMessages.NOT_FOUND);
    this.name = 'FileOutboxNotFoundError';
  }
}
