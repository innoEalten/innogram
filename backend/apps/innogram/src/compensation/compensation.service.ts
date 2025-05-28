import { Injectable, Scope, Logger } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class CompensationService {
  private readonly logger = new Logger(CompensationService.name);
  private compensations: (() => Promise<void>)[] = [];

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
        this.logger.error('Compensation failed');
      }
    }
  }
}
