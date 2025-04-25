import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponseDto implements User {
  id: number;
  email: string;
  created_at: Date;
  updated_at: Date;

  @Exclude()
  password: string;
}
