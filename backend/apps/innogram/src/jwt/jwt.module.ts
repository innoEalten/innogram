import { Module } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt.strategy';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [JwtStrategy],
  exports: [JwtStrategy],
})
export class JwtModule {}
