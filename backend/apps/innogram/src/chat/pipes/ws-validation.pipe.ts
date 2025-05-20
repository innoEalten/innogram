import { Injectable, ValidationPipe } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ValidationError } from 'class-validator';
import { CHAT_ERROR_MESSAGES } from 'libs/shared/src/constants/chat.constants';

@Injectable()
export class WSValidationPipe extends ValidationPipe {
  createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      if (this.isDetailedOutputDisabled) {
        return new WsException(CHAT_ERROR_MESSAGES.INVALID_MESSAGE);
      }
      const errors = this.flattenValidationErrors(validationErrors);

      return new WsException({
        message: CHAT_ERROR_MESSAGES.INVALID_MESSAGE,
        errors,
      });
    };
  }
}
