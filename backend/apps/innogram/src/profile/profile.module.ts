import { Module, forwardRef } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { PrismaModule } from '@app/prisma';
import { ProfileController } from './profile.controller';
import { ImageModule } from '../image/image.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, ImageModule, forwardRef(() => AuthModule)],
  providers: [ProfileService],
  exports: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
