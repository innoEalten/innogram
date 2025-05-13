import { Module, Logger } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '../jwt/jwt.module';

@Module({
  imports: [JwtModule],
  providers: [ChatGateway, Logger],
})
export class ChatModule {}
