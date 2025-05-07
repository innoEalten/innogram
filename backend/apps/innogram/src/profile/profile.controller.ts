import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from '../auth/guards/jwt.guard';
import { ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../auth/decorators/user.decorator';
import { User as UserType } from '@app/shared';
import { avatarFileValidationPipe } from './pipes/avatar-file-validation.pipe';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfile(@User() user: UserType) {
    return this.profileService.getProfile(user._id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadAvatar(
    @User() user: UserType,
    @UploadedFile(avatarFileValidationPipe)
    file: Express.Multer.File,
  ) {
    const profile = await this.profileService.uploadAvatar(user._id, file);

    return profile;
  }
}
