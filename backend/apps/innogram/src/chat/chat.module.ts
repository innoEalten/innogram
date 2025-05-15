import { Module, Logger } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '../jwt/jwt.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatRepository } from './chat.repository';
@Module({
  imports: [JwtModule],
  providers: [ChatGateway, Logger, ChatService, ChatRepository],
  controllers: [ChatController],
})
export class ChatModule {}
