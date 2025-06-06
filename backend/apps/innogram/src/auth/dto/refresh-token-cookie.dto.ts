import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenCookieDto {
  @IsString()
  @IsNotEmpty()
  cookie: string;
}
