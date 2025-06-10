import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class InitChatDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The ID of the user to chat with',
    example: '6825d53e6b1dc976e6583bca',
  })
  recipientId: string;
}
