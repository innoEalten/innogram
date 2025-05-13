import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import * as bcrypt from 'bcryptjs';

export class CreateTransformedUserDto {
  email: string;

  @Transform(({ value }) => bcrypt.hashSync(value as string, 10), {
    toClassOnly: true,
  })
  password: string;
}

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
