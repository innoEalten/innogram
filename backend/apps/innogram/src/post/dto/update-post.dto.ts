import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import {
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  IsOptional,
  IsArray,
  IsString,
} from 'class-validator';
import { PostErrorMessages } from '@app/shared';

@ValidatorConstraint({ name: 'atLeastOneField', async: false })
class AtLeastOneFieldConstraint implements ValidatorConstraintInterface {
  validate(_: unknown, args: ValidationArguments) {
    const obj = args.object as UpdatePostDto;
    return !!(obj.title || obj.body || obj.removeImageIds?.length);
  }

  defaultMessage() {
    return PostErrorMessages.AT_LEAST_ONE_PROPERTY_REQUIRED;
  }
}

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @Validate(AtLeastOneFieldConstraint)
  _atLeastOneField?: unknown;

  @ApiProperty({
    description: 'Array of image IDs to remove from the post',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  removeImageIds?: string[];
}
