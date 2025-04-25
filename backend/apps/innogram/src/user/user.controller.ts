import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
  // Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody } from '@nestjs/swagger';
import { FindOneByIdParams } from './dto/find-one-params.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { VerifyPasswordDto } from './dto/verify-password.dto';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: UserResponseDto })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOneById(@Param() params: FindOneByIdParams) {
    return await this.userService.findOneById(+params.id);
  }

  @Post('verify-password')
  async verifyPassword(@Body() verifyPasswordDto: VerifyPasswordDto) {
    return await this.userService.comparePassword(verifyPasswordDto);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
