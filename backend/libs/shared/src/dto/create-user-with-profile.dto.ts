import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserWithProfileDto {
  @ApiProperty({ default: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ default: 'John Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  name: string;

  @ApiProperty({ default: '+375291234567' })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({ default: 'stringst' })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;
}
