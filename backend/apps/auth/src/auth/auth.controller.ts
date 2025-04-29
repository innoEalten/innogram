import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '@app/shared';
import { ValidateAccessTokenDto } from './dto/validate-access-token.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerUserDto: CreateUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('validate-token')
  validateAccessToken(@Body() validateAccessTokenDto: ValidateAccessTokenDto) {
    return this.authService.validateAccessToken(
      validateAccessTokenDto.accessToken,
    );
  }

  @Post('refresh-access-token')
  refreshAccessToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshAccessToken(refreshTokenDto.refreshToken);
  }
}
