import { ConfigService } from '@nestjs/config';

const getAccessTokenExpirationTime = (configService: ConfigService) =>
  `${configService.getOrThrow('JWT_ACCESS_EXPIRATION_TIME')}s`;

export const jwtConfig = (configService: ConfigService) => ({
  secret: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
  signOptions: {
    expiresIn: getAccessTokenExpirationTime(configService),
  },
});
