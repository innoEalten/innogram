import {
  Controller,
  Post,
  Body,
  HttpCode,
  Headers,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, CreateUserWithProfileDto, Token } from '@app/shared';
import { AuthGuard } from './guards/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { Cookies } from './decorators/cookie.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setRefreshTokenCookie(res: Response, tokenObj: Token) {
    res.cookie('refreshToken', tokenObj.token, {
      httpOnly: true,
      secure: true,
      expires: new Date(tokenObj.expiresAt),
    });
  }

  @Post('register')
  async register(
    @Body() registerUserDto: CreateUserWithProfileDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(registerUserDto);

    this.setRefreshTokenCookie(res, result.tokens.refresh);

    return {
      user: result.user,
      profile: result.profile,
      tokens: { access: result.tokens.access },
    };
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginUserDto);

    this.setRefreshTokenCookie(res, result.tokens.refresh);

    return {
      user: result.user,
      profile: result.profile,
      tokens: {
        access: result.tokens.access,
      },
    };
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
  async refreshAccessToken(
    @Res({ passthrough: true }) res: Response,
    @Cookies('refreshToken') refreshToken: string,
  ) {
    const result = await this.authService.refreshAccessToken(refreshToken);

    this.setRefreshTokenCookie(res, result.refresh);

    return {
      tokens: { access: result.access },
    };
  }
}
