import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { User } from '../auth/decorators/user.decorator';
import { PaginationQueryDto, User as UserType } from '@app/shared';
import { JwtGuard } from '../jwt/guards/jwt.guard';
import { InitChatDto } from './dto/init-chat.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('chat')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('init')
  async initChat(@Body() body: InitChatDto, @User() user: UserType) {
    return this.chatService.getOrCreateChat(user._id, body.recipientId);
  }

  @Get()
  async getUserChats(
    @User() user: UserType,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return this.chatService.getUserChats(user._id, paginationQueryDto);
  }

  @Get('messages/:chatId')
  async getChatMessages(
    @Param('chatId') chatId: string,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return this.chatService.getChatMessages(chatId, paginationQueryDto);
  }
}
