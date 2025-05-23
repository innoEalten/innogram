import { IsOptional, IsPhoneNumber } from 'class-validator';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
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
