import { PartialType } from '@nestjs/mapped-types';
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

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  removeImageIds?: string[];
}
