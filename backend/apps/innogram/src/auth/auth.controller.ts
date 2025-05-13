import {
  Controller,
  Post,
  Body,
  HttpCode,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginUserDto,
  CreateUserWithProfileDto,
  RefreshTokenDto,
} from '@app/shared';
import { AuthGuard } from './guards/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDto: CreateUserWithProfileDto) {
    return await this.authService.register(registerUserDto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.login(loginUserDto);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  logout(@Headers('Authorization') authorization: string) {
    const token = authorization.replace('Bearer ', '');

    return this.authService.logout(token);
  }

  @Post('refresh-access-token')
  @HttpCode(200)
  async refreshAccessToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refreshAccessToken(
      refreshTokenDto.refreshToken,
    );
  }
}
