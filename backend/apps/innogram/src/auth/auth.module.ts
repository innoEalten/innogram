import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';
import { PrismaModule } from '@app/prisma';
import { ProfileModule } from '../profile/profile.module';
import { JwtModule } from '../jwt/jwt.module';

@Module({
  imports: [HttpModule, PrismaModule, ProfileModule, JwtModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AuthModule {}
