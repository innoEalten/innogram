import { Module, Logger } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '../jwt/jwt.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatRepository } from './chat.repository';
import { PrismaModule } from '@app/prisma';

@Module({
  imports: [JwtModule, PrismaModule],
  providers: [ChatGateway, Logger, ChatService, ChatRepository],
  controllers: [ChatController],
})
export class ChatModule {}
