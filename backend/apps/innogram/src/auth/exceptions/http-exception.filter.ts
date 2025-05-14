import { AUTH_ERROR_MESSAGES } from '@app/shared';
import { ErrorResponse } from '@app/shared/interfaces/error-response.interface';
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
    const { error, message = AUTH_ERROR_MESSAGES.INTERNAL_SERVER_ERROR } =
      exception.response?.data as ErrorResponse;

    response.status(status).json({
      statusCode: status,
      message: message,
      ...(error && { error }),
    });
  }
}
