import { Injectable } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
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

  async createMessage(chatId: string, senderId: string, content: string) {
    return this.chatRepository.createMessage(chatId, senderId, content);
  }

  async getMessages(chatId: string) {
    return this.chatRepository.getMessages(chatId);
  }
}
