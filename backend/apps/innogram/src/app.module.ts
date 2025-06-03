import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/env-validation.config';
import { PostModule } from './post/post.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule, PrismaService } from '@app/prisma';
import { ClsModule } from 'nestjs-cls';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PostgresModule } from './postgres';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema,
    }),
    EventEmitterModule.forRoot({
      global: true,
    }),
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          imports: [PrismaModule],
          adapter: new TransactionalAdapterPrisma({
            prismaInjectionToken: PrismaService,
          }),
        }),
      ],
    }),
    PostgresModule,
    AuthModule,
    ProfileModule,
    PostModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
