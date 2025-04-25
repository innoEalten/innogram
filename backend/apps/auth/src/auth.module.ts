import { validationSchema } from './config/mongo.validate';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshTokenSchema } from './schemas/refreshToken.schema';
import { HttpClientModule } from './http-client/http-client.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema,
    }),

    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
        dbName: configService.get('MONGO_DB_NAME'),
      }),
      inject: [ConfigService],
    }),

    MongooseModule.forFeature([
      {
        name: 'RefreshToken',
        schema: RefreshTokenSchema,
      },
    ]),

    HttpClientModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
