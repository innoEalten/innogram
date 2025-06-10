import { Socket } from 'socket.io';
import { ValidateTokenResponseDto } from '@app/shared/dto/auth-response.dto';

export interface SocketWithUser extends Socket {
  user: ValidateTokenResponseDto;
}
