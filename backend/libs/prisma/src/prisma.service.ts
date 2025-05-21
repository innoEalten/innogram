import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { AsyncLocalStorage } from 'async_hooks';

type Store = { tx: Prisma.TransactionClient | null };

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private asyncLocalStorage = new AsyncLocalStorage<Store>();

  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('DB connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('DB disconnected');
  }

  runInTransaction<T>(fn: () => Promise<T>): Promise<T> {
    return this.$transaction((tx) => {
      return this.asyncLocalStorage.run({ tx }, () => fn());
    });
  }

  getClient(): PrismaClient | Prisma.TransactionClient {
    const store = this.asyncLocalStorage.getStore();
    if (store?.tx) return store.tx;
    return this;
  }
}
