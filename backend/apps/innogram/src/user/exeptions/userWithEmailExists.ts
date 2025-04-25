import { ConflictException } from '@nestjs/common';

export class UserWithEmailExistsException extends ConflictException {
  constructor() {
    super('User with this email already exists');
  }
}
