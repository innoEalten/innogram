import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ObjectSchema, ValidationResult } from 'joi';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    const result: ValidationResult = this.schema.validate(value, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (result.error) {
      if (metadata.type === 'custom' && metadata.metatype?.name === 'Socket') {
        throw new WsException({
          message: 'Validation failed',
          errors: result.error.details.map((err) => err.message),
        });
      }

      throw new BadRequestException({
        message: 'Validation failed',
        errors: result.error.details.map((err) => err.message),
      });
    }

    return result.value;
  }
}
