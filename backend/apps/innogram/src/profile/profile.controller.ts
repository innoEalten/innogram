import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from '../auth/guards/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RequestWithUser } from '../auth/dto/req-user.dto';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfile(@Req() req: RequestWithUser) {
    return this.profileService.getProfile(req.user._id);
  }

  @Post()
  async uploadAvatar(@Req() req: RequestWithUser, @Body() file: Express.Multer.File) {
    return this.profileService.uploadAvatar(req.user._id, file);
  }
}
