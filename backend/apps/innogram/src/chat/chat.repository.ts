import { PrismaService } from '@app/prisma';
import { PaginationParams } from '@app/shared';
import { Injectable } from '@nestjs/common';
import type { ChatUserParams } from './types/chat-user-params.type';

@Injectable()
export class ChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  getChatWithUser(chatUserParams: ChatUserParams) {
    return this.prisma.chat.findFirst({
      where: {
        OR: [
          {
            initiatorId: chatUserParams.initiatorId,
            recipientId: chatUserParams.recipientId,
          },
          {
            initiatorId: chatUserParams.recipientId,
            recipientId: chatUserParams.initiatorId,
          },
        ],
      },
    });
  }

  getChatById(chatId: string) {
    return this.prisma.chat.findUnique({
      where: { id: chatId },
    });
  }

  createChat(chatUserParams: ChatUserParams) {
    return this.prisma.chat.create({
      data: chatUserParams,
    });
  }

  createMessage(chatId: string, senderId: string, content: string) {
    return this.prisma.message.create({
      data: { chatId, senderId, content },
    });
  }

  getChatMessagesWithTotal(chatId: string, pagination: PaginationParams) {
    return this.prisma.$transaction([
      this.prisma.message.findMany({
        ...pagination,
        where: { chatId },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.message.count({ where: { chatId } }),
    ]);
  }

  getUserChatsWithTotal(userId: string, pagination: PaginationParams) {
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
