import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '@app/prisma';
import { UserNotFoundException } from './exeptions/userNotFound.exeption';
import { Prisma } from '@prisma/client';
import { UserWithEmailExistsException } from './exeptions/userWithEmailExists';
import * as bcrypt from 'bcryptjs';
import { VerifyPasswordDto } from './dto/verify-password.dto';
import { InvalidCredentialsException } from './exeptions/invalidCredentials.exeption';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPass = await bcrypt.hash(createUserDto.password, 10);

    try {
      const user = await this.prismaService.user.create({
        data: {
          email: createUserDto.email,
          password: hashedPass,
        },
      });

      return user;
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new UserWithEmailExistsException();
      }

      throw err;
    }
  }

  async findAll() {
    return await this.prismaService.user.findMany();
  }

  async findOneById(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async comparePassword(verifyPasswordDto: VerifyPasswordDto) {
    if (!verifyPasswordDto.email || !verifyPasswordDto.password) {
      throw new InvalidCredentialsException();
    }

    const user = await this.prismaService.user.findUnique({
      where: { email: verifyPasswordDto.email },
    });

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const isPasswordCorrect = await bcrypt.compare(
      verifyPasswordDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new InvalidCredentialsException();
    }

    return user;
  }

  // TODO: Implement update user

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
