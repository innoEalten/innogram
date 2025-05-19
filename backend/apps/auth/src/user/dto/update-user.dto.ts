import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '@app/shared/dto/create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
