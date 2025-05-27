import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { CompensationService } from './compensation.service';

@Injectable()
export class CompensationInterceptor implements NestInterceptor {
  constructor(private readonly compensationService: CompensationService) {}

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
