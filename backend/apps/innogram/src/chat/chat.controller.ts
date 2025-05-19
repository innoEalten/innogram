import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { User } from '../auth/decorators/user.decorator';
import { User as UserType } from '@app/shared';
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

  @Get('messages/:chatId')
  async getMessages(@Param('chatId') chatId: string) {
    return this.chatService.getMessages(chatId);
  }
}
