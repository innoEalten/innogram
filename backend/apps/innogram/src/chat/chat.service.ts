import { BadRequestException, Injectable } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import {
  buildPaginationResponse,
  getPaginationParams,
  PaginationQueryDto,
} from '@app/shared';
import { Chat, Message } from '@prisma/client';
import type { ChatUserParams } from './types/chat-user-params.type';
import { ChatErrorMessages } from '@app/shared/constants/chat.constants';
import { WsException } from '@nestjs/websockets';
@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) {}

  async getOrCreateChat(chatUserParams: ChatUserParams) {
    const chat = await this.chatRepository.getChatWithUser(chatUserParams);

    if (!chat) {
      return this.chatRepository.createChat(chatUserParams);
    }

    return chat;
  }

  async getValidatedUserChat(chatId: string, userId: string) {
    const chat = await this.chatRepository.getChatById(chatId);

    if (!chat || (chat.initiatorId !== userId && chat.recipientId !== userId))
      throw new WsException(ChatErrorMessages.INVALID_CHAT);

    return chat;
  }

  createMessage(chatId: string, senderId: string, content: string) {
    return this.chatRepository.createMessage(chatId, senderId, content);
  }

  async getChatMessages(chatId: string, { page, limit }: PaginationQueryDto) {
    const chat = await this.chatRepository.getChatById(chatId);

    if (!chat) throw new BadRequestException(ChatErrorMessages.INVALID_CHAT);

    const [data, total] = await this.chatRepository.getChatMessagesWithTotal(
      chatId,
      getPaginationParams({ page, limit }),
    );

    return buildPaginationResponse<Message>(data, {
      page,
      limit,
      total,
    });
  }

  async getUserChats(userId: string, { page, limit }: PaginationQueryDto) {
    const [data, total] = await this.chatRepository.getUserChatsWithTotal(
      userId,
      getPaginationParams({ page, limit }),
    );

    return buildPaginationResponse<Chat>(data, {
      page,
      limit,
      total,
    });
  }
}
