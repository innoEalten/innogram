import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { APP_FILTER } from '@nestjs/core';
import { AxiosExceptionFilter } from './exceptions/axios-exception.filter';
import { PrismaModule } from '@app/prisma';
import { JwtModule } from '../jwt/jwt.module';

@Module({
  imports: [HttpModule, PrismaModule, JwtModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_FILTER,
      useClass: AxiosExceptionFilter,
    },
  ],
})
export class AuthModule {}
