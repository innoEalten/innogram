import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ChatParamsDto {
  @IsUUID()
  @ApiProperty({
    description: 'The ID of the existing chat',
    example: '6e64fc50-dfd0-4f79-86cb-7fab23fc7244',
  })
  chatId: string;
}
