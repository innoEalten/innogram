import { Body, Controller, HttpCode, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '@app/shared';
import { RefreshTokenDto } from '../../../../libs/shared/src/dto/refresh-token.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDto: CreateUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('validate-token')
  @HttpCode(200)
  @ApiBearerAuth()
  async validateAccessToken(@Headers('Authorization') authorization: string) {
    const token = authorization?.replace('Bearer ', '');

    return this.authService.validateAccessToken(token);
  }

  @Post('logout')
  @HttpCode(200)
  @ApiBearerAuth()
  async logout(@Headers('Authorization') authorization: string) {
    const token = authorization?.replace('Bearer ', '');

    return this.authService.logout(token);
  }

  @Post('refresh-access-token')
  @HttpCode(200)
  async refreshAccessToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshAccessToken(refreshTokenDto.refreshToken);
  }
}
