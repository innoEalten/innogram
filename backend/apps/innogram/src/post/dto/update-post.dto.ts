import { PartialType } from '@nestjs/swagger';
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

@ValidatorConstraint({ name: 'atLeastOneFile', async: false })
class AtLeastOneFileConstraint implements ValidatorConstraintInterface {
  validate(_: unknown, args: ValidationArguments) {
    const obj = args.object as UpdatePostDto;
    return !!(obj.title || obj.body || obj.removeImageIds?.length);
  }

  defaultMessage(_: ValidationArguments) {
    return 'At least one of the properties (title, body, removeImageIds) must be provided.';
  }
}

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @Validate(AtLeastOneFileConstraint)
  _atLeastOneFile?: unknown;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  removeImageIds?: string[];
}
