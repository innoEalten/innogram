import { Exclude, Expose } from 'class-transformer';
import { User } from '../../schemas/user.schema';
import { RefreshToken } from '../../schemas/refresh-token.schema';

@Exclude()
export class UserResponseDto implements User {
  @Expose()
  _id: string;

  @Expose()
  email: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Exclude()
  password: string;

  @Exclude()
  refreshToken: RefreshToken;
}
