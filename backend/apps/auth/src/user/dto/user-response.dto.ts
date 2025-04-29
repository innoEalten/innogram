import { Exclude } from 'class-transformer';
import { User } from '../../schemas/user.schema';
import { RefreshToken } from '../../schemas/refresh-token.schema';

export class UserResponseDto implements User {
  id: number;
  email: string;
  // created_at: Date;
  // updated_at: Date;

  @Exclude()
  password: string;

  @Exclude()
  refreshToken: RefreshToken;
}
