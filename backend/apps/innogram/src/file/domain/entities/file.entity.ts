import { randomUUID } from 'crypto';

type FileData = {
  id?: string;
  url: string;
};

export class FileEntity {
  constructor(
    public readonly id: string,
    public readonly url: string,
  ) {}

  static create({ id = randomUUID(), url }: FileData): FileEntity {
    return new FileEntity(id, url);
  }
}
