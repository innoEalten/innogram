import { Request } from 'express';
import { ValidateTokenResponseDto } from '../dto/auth-response.dto';

export interface RequestWithUser extends Request {
  user: ValidateTokenResponseDto;
}
