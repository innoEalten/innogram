import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getChatWithUser(initiatorId: string, recipientId: string) {
    return this.prisma.chat.findFirst({
      where: {
        OR: [
          { initiatorId, recipientId },
          { initiatorId: recipientId, recipientId: initiatorId },
        ],
      },
    });
  }

  async getChatById(chatId: string) {
    return this.prisma.chat.findUnique({
      where: { id: chatId },
    });
  }

  async createChat(initiatorId: string, recipientId: string) {
    return this.prisma.chat.create({
      data: { initiatorId, recipientId },
    });
  }

  async createMessage(chatId: string, senderId: string, content: string) {
    return this.prisma.message.create({
      data: { chatId, senderId, content },
    });
  }

  async getMessages(chatId: string) {
    return this.prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
