import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { APP_FILTER } from '@nestjs/core';
import { AxiosExceptionFilter } from './exceptions/axios-exception.filter';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from '@app/prisma';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [HttpModule, PrismaModule, ProfileModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_FILTER,
      useClass: AxiosExceptionFilter,
    },
    JwtStrategy,
  ],
})
export class AuthModule {}
