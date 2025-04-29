import { Controller, Post, Body, HttpCode, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { LoginUserDto, CreateUserDto, RefreshTokenDto } from '@app/shared';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDto: CreateUserDto) {
    return await this.authService.register(registerUserDto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.login(loginUserDto);
  }

  @Post('validate-token')
  @HttpCode(200)
  @ApiBearerAuth()
  validateAccessToken(@Headers('Authorization') authorization: string) {
    const token = authorization?.replace('Bearer ', '');

    return this.authService.validateAccessToken(token);
  }

  @Post('refresh-access-token')
  @HttpCode(200)
  async refreshAccessToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refreshAccessToken(
      refreshTokenDto.refreshToken,
    );
  }
}
