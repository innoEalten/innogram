import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ default: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ default: 'stringst' })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;
}
