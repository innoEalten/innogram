import { Injectable } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import {
  buildPaginationResponse,
  getPaginationParams,
  PaginationQueryDto,
} from '@app/shared';
import { Chat, Message } from '@prisma/client';
@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) {}

  async getOrCreateChat(initiatorId: string, recipientId: string) {
    const chat = await this.chatRepository.getChatWithUser(
      initiatorId,
      recipientId,
    );

    if (!chat) {
      return this.chatRepository.createChat(initiatorId, recipientId);
    }

    return chat;
  }

  async getValidatedUserChat(chatId: string, userId: string) {
    const chat = await this.chatRepository.getChatById(chatId);

    if (!chat || (chat.initiatorId !== userId && chat.recipientId !== userId))
      return;

    return chat;
  }

  async createMessage(chatId: string, senderId: string, content: string) {
    return this.chatRepository.createMessage(chatId, senderId, content);
  }

  async getChatMessages(chatId: string, { page, limit }: PaginationQueryDto) {
    const [data, total] = await this.chatRepository.getChatMessagesWithTotal(
      chatId,
      getPaginationParams(page, limit),
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
      getPaginationParams(page, limit),
    );

    return buildPaginationResponse<Chat>(data, {
      page,
      limit,
      total,
    });
  }
}
