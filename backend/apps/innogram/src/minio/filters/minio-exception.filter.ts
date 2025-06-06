import {
  ExceptionFilter,
  Catch,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { S3Error } from 'minio';
import { ResponseErrorData } from '@app/shared';

@Catch(S3Error)
export class MinioExceptionFilter implements ExceptionFilter {
  catch(exception: S3Error) {
    const responseData: ResponseErrorData = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.message,
      error: exception.name,
    };

    if (exception.code === 'NoSuchKey') {
      responseData.statusCode = HttpStatus.NOT_FOUND;
    }

    throw new HttpException(responseData, responseData.statusCode);
  }
}
