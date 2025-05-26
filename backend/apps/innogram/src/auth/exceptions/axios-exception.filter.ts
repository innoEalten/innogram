import { AuthErrorMessages, ResponseErrorData } from '@app/shared';

import {
  ExceptionFilter,
  Catch,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AxiosError } from 'axios';
@Catch(AxiosError)
export class AxiosExceptionFilter implements ExceptionFilter {
  catch(exception: AxiosError<ResponseErrorData>) {
    const axiosResponse = exception.response;

    const responseData: ResponseErrorData = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: AuthErrorMessages.INTERNAL_SERVER_ERROR,
    };

    if (axiosResponse) {
      responseData.statusCode = axiosResponse.status;

      responseData.message = axiosResponse.data.message;
      responseData.error = axiosResponse.data.error;
    }

    throw new HttpException(responseData, responseData.statusCode);
  }
}
