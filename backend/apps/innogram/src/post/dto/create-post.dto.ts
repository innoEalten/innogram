import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  body: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    maxItems: 5,
    description: 'Image files to upload (max 5 files)',
  })
  files: Express.Multer.File[];
}

export type CreatePostWithAuthorDto = CreatePostDto & {
  authorId: string;
};
