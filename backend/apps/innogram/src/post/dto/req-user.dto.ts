import { Request } from 'express';
import { ValidateTokenResponseDto } from '@app/shared/dto/auth-response.dto';

export interface RequestWithUser extends Request {
  user: ValidateTokenResponseDto;
}
