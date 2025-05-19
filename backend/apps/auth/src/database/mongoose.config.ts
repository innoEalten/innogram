import { ConfigService } from '@nestjs/config';

export const mongooseConfig = (configService: ConfigService) => ({
  uri: configService.getOrThrow<string>('MONGO_URI'),
  dbName: configService.getOrThrow<string>('MONGO_DB_NAME'),
});
