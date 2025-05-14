import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../../../../libs/shared/src/dto/create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
