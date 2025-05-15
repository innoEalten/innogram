import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { User } from '../auth/decorators/user.decorator';
import { User as UserType } from '@app/shared';
import { JwtGuard } from '../jwt/guards/jwt.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('init')
  @UseGuards(JwtGuard)
  async initChat(
    @Body() body: { recipientId: string },
    @User() user: UserType,
  ) {
    return this.chatService.getOrCreateChat(user._id, body.recipientId);
  }

  @Get('messages/:chatId')
  @UseGuards(JwtGuard)
  async getMessages(@Param('chatId') chatId: string) {
    return this.chatService.getMessages(chatId);
  }
}
