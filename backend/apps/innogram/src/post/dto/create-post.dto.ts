import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    example: 'Sunset at the beach',
    description: 'Title of the post',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'A beautiful photo from today.',
    description: 'Body/content of the post',
  })
  @IsString()
  @IsNotEmpty()
  body: string;
}

export interface PostWithAuthor extends CreatePostDto {
  authorId: string;
}
