import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongoModule } from './mongo/mongo.module';

@Module({
  imports: [MongoModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
