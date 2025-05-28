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

  async getChatMessagesWithTotal(
    chatId: string,
    pagination: { skip: number; take: number },
  ) {
    return this.prisma.$transaction([
      this.prisma.message.findMany({
        ...pagination,
        where: { chatId },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.message.count({ where: { chatId } }),
    ]);
  }

  async getUserChatsWithTotal(
    userId: string,
    pagination: { skip: number; take: number },
  ) {
    return this.prisma.$transaction([
      this.prisma.chat.findMany({
        ...pagination,
        where: { OR: [{ initiatorId: userId }, { recipientId: userId }] },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            take: 1,
          },
        },
      }),
      this.prisma.chat.count({
        where: { OR: [{ initiatorId: userId }, { recipientId: userId }] },
      }),
    ]);
  }
}
