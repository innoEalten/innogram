import { Injectable } from '@nestjs/common';
import { LoginUserDto } from '@app/shared';
import { UserService } from '../user/user.service';
import { JwtService } from '../jwt/jwt.service';
import { plainToClass } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';
import { InvalidCredentialsException } from '../user/exceptions/invalid-credentials.exception';
import { CreateTransformedUserDto } from '@app/shared/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { UserWithEmailExistsException } from '../user/exceptions/user-with-email-exists.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateTransformedUserDto) {
    const existingUser = await this.userService.findOneByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new UserWithEmailExistsException();
    }

    const newUser = await this.userService.create(
      plainToClass(CreateTransformedUserDto, createUserDto),
    );

    const tokens = {
      access: this.jwtService.signAccessToken(newUser._id.toString()),
      refresh: this.jwtService.signRefreshToken(newUser._id.toString()),
    };

    await this.userService.setRefreshToken(
      newUser._id.toString(),
      tokens.refresh.token,
      tokens.refresh.expiresAt,
    );

    return {
      user: plainToClass(
        UserResponseDto,
        {
          ...newUser.toObject(),
          _id: newUser._id.toString(),
        },
        {
          excludeExtraneousValues: true,
        },
      ),
      tokens,
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userService.findOneByEmail(loginUserDto.email);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const isPasswordCorrect = await this.comparePassword(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new InvalidCredentialsException();
    }

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

  async logout(userId: string) {
    await this.userService.deleteRefreshToken(userId);
  }

  async validateAccessToken(accessToken: string) {
    const user = await this.userService.findOneById(
      this.jwtService.validateAccessToken(accessToken).sub,
    );

    if (!user) {
      throw new InvalidCredentialsException();
    }

    return user._id.toString();
  }

  async getUserById(userId: string) {
    const user = await this.userService.findOneById(userId);

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

  private async comparePassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }
}
