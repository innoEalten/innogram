import { ConfigService } from '@nestjs/config';

export const jwtConfig = (configService: ConfigService) => ({
  secret: configService.get('JWT_ACCESS_SECRET') as string,
  signOptions: {
    expiresIn: `${configService.get('JWT_ACCESS_EXPIRATION_TIME')}s`,
  },
});
