import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
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
  validate(_: any, args: ValidationArguments) {
    const obj = args.object as any;
    return !!(obj.title || obj.body || obj.files);
  }

  defaultMessage(_: ValidationArguments) {
    return 'At least one of the properties (title, body, files) must be provided.';
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
