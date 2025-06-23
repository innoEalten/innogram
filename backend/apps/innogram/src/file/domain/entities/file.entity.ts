import { randomUUID } from 'crypto';

export class FileEntity {
  constructor(
    public readonly id: string = randomUUID(),
    public readonly url: string,
  ) {}
}
