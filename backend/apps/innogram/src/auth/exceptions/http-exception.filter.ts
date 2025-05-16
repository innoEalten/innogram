import { AUTH_ERROR_MESSAGES } from '@app/shared';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { Response } from 'express';

@Catch(AxiosError)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: AxiosError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;

    const data = exception.response?.data;

    let message = AUTH_ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
    let error: string | undefined;

    if (data && typeof data === 'object') {
      if ('message' in data && typeof data.message === 'string') {
        message = data.message;
      }

      if ('error' in data && typeof data.error === 'string') {
        error = data.error;
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
      ...(error && { error }),
    });
  }
}
