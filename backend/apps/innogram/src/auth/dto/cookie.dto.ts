import { IsNotEmpty, IsString } from 'class-validator';

export class CookieDto {
  @IsString()
  @IsNotEmpty()
  cookie: string;
}
