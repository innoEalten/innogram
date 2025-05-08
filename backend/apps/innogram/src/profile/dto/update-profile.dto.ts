import { IsOptional, IsPhoneNumber } from 'class-validator';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  name?: string;

  @IsPhoneNumber()
  @IsOptional()
  @ApiProperty()
  phone?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  bio?: string;
}
