import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '@app/shared';
import { ReqWithUser } from './interfaces/req-with-user.interface';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBody } from '@nestjs/swagger';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerUserDto: CreateUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginUserDto })
  login(@Req() req: ReqWithUser) {
    const { user } = req;
    return user;
  }
}
