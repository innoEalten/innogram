import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { Client } from 'pg';
import { ConfigService } from '@nestjs/config';
import { FileService } from '../file';
import { PostgresWorkerConstants as C } from './constants/postgres.constant';

@Injectable()
export class PostgresWorker implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly configService: ConfigService,
    private readonly fileService: FileService,
  ) {}

  private client: Client;
  private readonly logger = new Logger(PostgresWorker.name);

  async onModuleInit() {
    this.client = new Client({
      connectionString: this.configService.get<string>('POSTGRES_URI'),
    });

    await this.client.connect();
    this.logger.log(C.WORKER_CONNECTED);

    await this.client.query(`LISTEN ${C.LISTEN_CHANNEL}`);

    this.client.on('notification', async ({ payload: fileOutboxId }) => {
      this.logger.log(`${C.STARTED_PROCESSING_PREFIX} ${fileOutboxId}`);

      if (!fileOutboxId) {
        this.logger.warn(C.NO_PAYLOAD_WARNING);
        return;
      }

      await this.fileService.processFileOutbox(fileOutboxId);
    });

    this.client.on('error', (err) => {
      this.logger.error(C.WORKER_ERROR, err);
    });
  }

  async onModuleDestroy() {
    this.client.removeAllListeners('notification');
    await this.client.end();
    this.logger.log(C.WORKER_DISCONNECTED);
  }
}
