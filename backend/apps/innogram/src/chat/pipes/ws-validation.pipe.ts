import { Injectable, ValidationPipe } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ValidationError } from 'class-validator';
import { ChatErrorMessages } from '@app/shared/constants/chat.constants';

@Injectable()
export class WSValidationPipe extends ValidationPipe {
  createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      if (this.isDetailedOutputDisabled) {
        return new WsException(ChatErrorMessages.INVALID_MESSAGE);
      }
      const errors = this.flattenValidationErrors(validationErrors);

      return new WsException({
        message: ChatErrorMessages.INVALID_MESSAGE,
        errors,
      });
    };
  }
}
