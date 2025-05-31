import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { MinioCompensationService } from './minio-compensation.service';

@Injectable()
export class MinioCompensationInterceptor implements NestInterceptor {
  constructor(private readonly compensationService: MinioCompensationService) {}

  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(async (error) => {
        if (this.compensationService.hasCompensations()) {
          await this.compensationService.runCompensations();
        }
        throw error;
      }),
    );
  }
}
