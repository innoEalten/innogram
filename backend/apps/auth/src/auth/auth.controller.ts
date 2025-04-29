import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '@app/shared';
import { ApiBody } from '@nestjs/swagger';
import { ValidateAccessTokenDto } from './dto/validate-access-token.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerUserDto: CreateUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiBody({ type: LoginUserDto })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('validate-token')
  validateAccessToken(@Body() validateAccessTokenDto: ValidateAccessTokenDto) {
    return this.authService.validateAccessToken(
      validateAccessTokenDto.accessToken,
    );
  }
}
