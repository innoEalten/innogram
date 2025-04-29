import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateAccessTokenDto {
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
