import { Injectable, Scope, Logger } from '@nestjs/common';
import { MinioErrorMessages } from '@app/shared';

@Injectable({ scope: Scope.REQUEST })
export class MinioCompensationService {
  private readonly logger = new Logger(MinioCompensationService.name);
  compensations: (() => Promise<void>)[] = [];

  hasCompensations(): boolean {
    return this.compensations.length > 0;
  }

  register(compensationFn: () => Promise<void>) {
    this.compensations.push(compensationFn);
  }

  async runCompensations() {
    for (const fn of this.compensations.reverse()) {
      try {
        await fn();
      } catch (error) {
        this.logger.error(MinioErrorMessages.MINIO_COMPENSATION_ERROR, error);
      }
    }
  }
}
