import { ConfigService } from '@nestjs/config';

export const getMongoConfig = (configService: ConfigService) => ({
  uri: configService.get('MONGO_URI') as string,
  dbName: configService.get('MONGO_DB_NAME') as string,
});
