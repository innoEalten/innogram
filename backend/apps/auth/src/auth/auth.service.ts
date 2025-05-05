import { Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from '@app/shared';
import { UserService } from '../user/user.service';
import { JwtService } from '../jwt/jwt.service';
import { plainToClass } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';
import { InvalidCredentialsException } from '../user/exeptions/invalidCredentials.exeption';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);

    const tokens = {
      access: this.jwtService.signAccessToken(user._id.toString()),
      refresh: this.jwtService.signRefreshToken(user._id.toString()),
    };

    await this.userService.setRefreshToken(
      user._id.toString(),
      tokens.refresh.token,
      tokens.refresh.expiresAt,
    );

    return {
      user: plainToClass(
        UserResponseDto,
        {
          ...user.toObject(),
          _id: user._id.toString(),
        },
        {
          excludeExtraneousValues: true,
        },
      ),
      tokens,
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userService.comparePassword(loginUserDto);

    const tokens = {
      access: this.jwtService.signAccessToken(user._id.toString()),
      refresh: this.jwtService.signRefreshToken(user._id.toString()),
    };

    await this.userService.setRefreshToken(
      user._id.toString(),
      tokens.refresh.token,
      tokens.refresh.expiresAt,
    );

    return {
      user: plainToClass(
        UserResponseDto,
        {
          ...user.toObject(),
          _id: user._id.toString(),
        },
        {
          excludeExtraneousValues: false,
        },
      ),
      tokens,
    };
  }

  async logout(token: string) {
    const { sub: userId } = this.jwtService.validateAccessToken(token);

    await this.userService.deleteRefreshToken(userId);
  }

  async validateAccessToken(accessToken: string) {
    const user = await this.userService.findOneById(
      this.jwtService.validateAccessToken(accessToken).sub,
    );

    return plainToClass(
      UserResponseDto,
      {
        ...user.toObject(),
        _id: user._id.toString(),
      },
      {
        excludeExtraneousValues: false,
      },
    );
  }

  async refreshAccessToken(refreshToken: string) {
    const { sub: userId } = this.jwtService.validateRefreshToken(refreshToken);
    const user = await this.userService.findOneById(userId);

    if (user.refreshToken.token !== refreshToken) {
      throw new InvalidCredentialsException();
    }

    const tokens = {
      access: this.jwtService.signAccessToken(userId),
      refresh: this.jwtService.signRefreshToken(userId),
    };

    await this.userService.setRefreshToken(
      userId,
      tokens.refresh.token,
      tokens.refresh.expiresAt,
    );

    return {
      tokens,
    };
  }
}
