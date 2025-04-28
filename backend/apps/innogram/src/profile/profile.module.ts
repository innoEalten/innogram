import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { PrismaModule } from '@app/prisma';

@Module({
  imports: [PrismaModule],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
