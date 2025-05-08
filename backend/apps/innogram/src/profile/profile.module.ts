import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { PrismaModule } from '@app/prisma';
import { ProfileController } from './profile.controller';
import { ImageModule } from '../image/image.module';
import { ProfileRepository } from './profile.repository';
import { JwtModule } from '../jwt/jwt.module';

@Module({
  imports: [PrismaModule, ImageModule, JwtModule],
  providers: [ProfileService, ProfileRepository],
  exports: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
