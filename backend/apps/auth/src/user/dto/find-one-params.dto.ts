import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumberString } from 'class-validator';

export class FindOneByIdParams {
  @ApiProperty()
  @IsNumberString()
  id: number;
}
