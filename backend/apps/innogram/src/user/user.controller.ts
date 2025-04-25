import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  // Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody } from '@nestjs/swagger';
import {
  FindOneByEmailParams,
  FindOneByIdParams,
} from './dto/find-one-params.dto';
import * as bcrypt from 'bcryptjs';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    const hashedPass = await bcrypt.hash(createUserDto.password, 10);

    return await this.userService.create({
      ...createUserDto,
      password: hashedPass,
    });
  }

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('id/:id')
  async findOneById(@Param() params: FindOneByIdParams) {
    return await this.userService.findOneById(+params.id);
  }

  @Get('email/:email')
  async findOneByEmail(@Param() params: FindOneByEmailParams) {
    return await this.userService.findOneByEmail(params.email);
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
